import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const btnStyle = (isActive) => ({
    background: isActive ? "rgba(34,211,238,0.2)" : "transparent",
    color: isActive ? "#22d3ee" : "rgba(255,255,255,0.85)",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div
      className="editor-toolbar"
      style={{
        display: "flex",
        gap: "4px",
        padding: "10px 52px",
        background: "rgba(10,12,30,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap",
      }}
    >
      <button onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))}>I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} style={btnStyle(editor.isActive('underline'))}>U</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive('strike'))}>S</button>
      
      <div style={{ width: "1px", background: "rgba(255,255,255,0.15)", margin: "4px 4px" }} />
      
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive('heading', { level: 1 }))}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))}>H2</button>
      
      <div style={{ width: "1px", background: "rgba(255,255,255,0.15)", margin: "4px 4px" }} />

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))}>1. List</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))}>Quote</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btnStyle(editor.isActive('codeBlock'))}>Code</button>
    </div>
  )
}

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your notes here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-cyan focus:outline-none max-w-none',
        style: 'min-height: 100%; padding: 24px 52px; font-family: "DM Sans", sans-serif; font-size: 16px; line-height: 1.9; color: rgba(215,230,255,0.82);',
      },
    },
  });

  // Update content when the active section changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <MenuBar editor={editor} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <style>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            color: rgba(255,255,255,0.2);
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
          .ProseMirror h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; color: white; }
          .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; color: white; }
          .ProseMirror h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; color: white; }
          .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
          .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
          .ProseMirror blockquote { border-left: 3px solid #22d3ee; padding-left: 1em; margin-bottom: 1em; color: rgba(255,255,255,0.6); }
          .ProseMirror code { background: rgba(255,255,255,0.1); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; }
          .ProseMirror pre { background: rgba(0,0,0,0.3); padding: 1em; border-radius: 8px; overflow-x: auto; font-family: monospace; }
        `}</style>
        <EditorContent editor={editor} style={{ minHeight: '100%' }} />
      </div>
    </div>
  );
}
