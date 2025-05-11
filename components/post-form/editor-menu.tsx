import { Editor } from "@tiptap/react";

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="btn font-bold"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="btn"
      >
        <p className="italic">Italic</p>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="btn underline"
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="btn"
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="btn"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="btn"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="btn"
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="btn"
      >
        Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className="btn"
      >
        Code Block
      </button>
    </div>
  );
};
