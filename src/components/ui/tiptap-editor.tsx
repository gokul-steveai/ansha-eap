"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Quote, Undo2, Redo2, Minus
} from "lucide-react";

type TiptapEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert min-h-[160px] p-3 focus:outline-none",
      },
    },
  });

  // ✅ Sync external value (from react-hook-form reset) with Tiptap editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });

    }
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({
    isActive,
    canRun = true,
    onClick,
    children,
    label,
  }: {
    isActive?: boolean;
    canRun?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    label?: string;
  }) => (
    <Button
      type="button"
      size="icon"
      variant={isActive ? "default" : "outline"}
      disabled={!canRun}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </Button>
  );

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <Btn
          label="Bold"
          isActive={editor.isActive("bold")}
          canRun={editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Btn>
        <Btn
          label="Italic"
          isActive={editor.isActive("italic")}
          canRun={editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Btn>
        <Btn
          label="Strike"
          isActive={editor.isActive("strike")}
          canRun={editor.can().chain().focus().toggleStrike().run()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Btn>

        <div className="mx-1 my-0.5 h-5 w-px bg-muted" />

        <Btn
          label="Bullet List"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Btn>
        <Btn
          label="Ordered List"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Btn>

        <div className="mx-1 my-0.5 h-5 w-px bg-muted" />

        <Btn
          label="H1"
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Btn>
        <Btn
          label="H2"
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Btn>

        <div className="mx-1 my-0.5 h-5 w-px bg-muted" />

        <Btn
          label="Quote"
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Btn>
        <Btn
          label="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </Btn>

        <div className="mx-1 my-0.5 h-5 w-px bg-muted" />

        <Btn
          label="Undo"
          canRun={editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </Btn>
        <Btn
          label="Redo"
          canRun={editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </Btn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
