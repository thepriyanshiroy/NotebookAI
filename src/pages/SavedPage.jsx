import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";
import PdfList from "../components/saved/PdfList";
import PdfPreview from "../components/saved/PdfPreview";
import AiSummaryPanel from "../components/saved/AiSummaryPanel";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// 🔥 Retry helper for Gemini API
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const text = await res.text();

      if (res.status >= 500 && retries > 0) {
        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }

      throw new Error(text);
    }

    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
};

export default function SavedPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [summaryPdf, setSummaryPdf] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState(null);

  const showSplit = previewPdf && summaryPdf && previewPdf.id === summaryPdf.id;

  useEffect(() => {
    loadPdfs();
  }, []);

  const loadPdfs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("saved_pdfs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPdfs(data ?? []);
    } catch (err) {
      setError("Failed to load: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const filePath = `${user.id}/${Date.now()}_${file.name}`;

        const { error: uploadErr } = await supabase.storage
          .from("pdfs")
          .upload(filePath, file);

        if (uploadErr) throw uploadErr;

        const { data, error: dbErr } = await supabase
          .from("saved_pdfs")
          .insert([
            {
              user_id: user.id,
              name: file.name,
              storage_path: filePath,
              size_bytes: file.size,
              summary: null,
            },
          ])
          .select()
          .single();

        if (dbErr) throw dbErr;

        setPdfs((prev) => [data, ...prev]);
      } catch (err) {
        setError("Upload failed: " + err.message);
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const handlePreview = async (pdf) => {
    try {
      setError(null);

      const { data, error } = await supabase.storage
        .from("pdfs")
        .createSignedUrl(pdf.storage_path, 3600);

      if (error) throw error;

      setPreviewPdf({ ...pdf, url: data.signedUrl });
      setSummaryPdf(null);
      setAiText("");
    } catch (err) {
      setError("Preview failed: " + err.message);
    }
  };

  const handleSummarize = async (pdf) => {
    if (summarizing) return; // 🔒 prevent multiple calls

    try {
      setError(null);
      setSummarizing(true);
      setAiText("");

      const { data: urlData, error: urlErr } = await supabase.storage
        .from("pdfs")
        .createSignedUrl(pdf.storage_path, 3600);

      if (urlErr) throw urlErr;

      setPreviewPdf({ ...pdf, url: urlData.signedUrl });
      setSummaryPdf(pdf);

      if (pdf.summary) {
        setAiText(pdf.summary);
        setSummarizing(false);
        return;
      }

      const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (!GEMINI_KEY) {
        setError("Gemini API key missing in .env");
        return;
      }

      // 🔥 Extract text
      const pdfDoc = await pdfjsLib.getDocument(urlData.signedUrl).promise;

      let fullText = "";
      const maxPages = Math.min(pdfDoc.numPages, 10); // reduce load

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();

        fullText += content.items.map((item) => item.str || "").join(" ");
      }

      if (!fullText.trim()) {
        setError("Could not extract text from PDF");
        return;
      }

      // 🔥 Gemini request with retry
      const res = await fetchWithRetry(
        `/gemini/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        //`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Summarize this PDF for a student in a structured way:

${fullText.slice(0, 15000)}

Give:
1. Overview
2. Key points
3. Important details
4. Examples
5. Final takeaway`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const result = await res.json();

      let summary = "";

      if (result?.candidates?.length) {
        summary = result.candidates[0].content.parts
          .map((p) => p.text || "")
          .join("")
          .trim();
      }

      if (!summary) summary = "Could not generate summary.";

      setAiText(summary);

      await supabase.from("saved_pdfs").update({ summary }).eq("id", pdf.id);

      setPdfs((prev) =>
        prev.map((p) => (p.id === pdf.id ? { ...p, summary } : p)),
      );
    } catch (err) {
      console.error("[Gemini] Error:", err);

      if (err.message.includes("503")) {
        setError("Server is busy. Try again in a few seconds.");
      } else {
        setError("Summary failed: " + err.message);
      }
    } finally {
      setSummarizing(false);
    }
  };

  const handleDelete = async (pdf) => {
    try {
      await supabase.storage.from("pdfs").remove([pdf.storage_path]);
      await supabase.from("saved_pdfs").delete().eq("id", pdf.id);

      setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));

      if (previewPdf?.id === pdf.id) {
        setPreviewPdf(null);
        setSummaryPdf(null);
      }
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const closeAll = () => {
    setPreviewPdf(null);
    setSummaryPdf(null);
    setAiText("");
  };

  return (
    <AppLayout notebookCount={null}>
      {error && (
        <div style={{ padding: "10px", background: "red", color: "white", textAlign: "center" }}>
          {error} <button onClick={() => setError(null)}>X</button>
        </div>
      )}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {!previewPdf && (
          <PdfList
            pdfs={pdfs}
            loading={loading}
            uploading={uploading}
            onUpload={handleUpload}
            onPreview={handlePreview}
            onSummarize={handleSummarize}
            onDelete={handleDelete}
          />
        )}

        {previewPdf && !showSplit && (
          <PdfPreview
            pdf={previewPdf}
            onClose={() => setPreviewPdf(null)}
            onSummarize={handleSummarize}
          />
        )}

        {showSplit && (
          <div style={{ flex: 1, display: "flex" }}>
            <PdfPreview pdf={previewPdf} splitMode onClose={closeAll} />
            <AiSummaryPanel
              summarizing={summarizing}
              aiText={aiText}
              onClose={closeAll}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
