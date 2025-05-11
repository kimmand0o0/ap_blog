"use client";

import { Dispatch, SetStateAction } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { MenuBar } from "@/components/post-form/editor-menu";

interface TipTapEditorProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

export default function TipTapEditor({
  title,
  setTitle,
  content,
  setContent,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
  });

  const handleTitleOut = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!editor) return;
    if (e.key === "Enter") {
      editor.commands.focus("end");
    }
  };

  return (
    <div className="border rounded-md p-4 h-full">
      <input
        type="text"
        className="w-full border-b-[1px] p-2 mb-2 text-2xl focus:outline-none"
        placeholder="제목을 입력하세요."
        value={title}
        onKeyDown={handleTitleOut}
        onChange={(e) => setTitle(e.target.value)}
      />
      <MenuBar editor={editor} />
      <div
        className="size-full min-h-[300px]"
        onClick={() => editor?.commands.focus("end")}
      >
        <EditorContent
          editor={editor}
          onBlur={() => {
            if (editor) {
              setContent(editor.getHTML());
            }
          }}
          className="prose prose-sm sm:prose lg:prose-lg w-full px-3"
        />
      </div>
    </div>
  );
}
