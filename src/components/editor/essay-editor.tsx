"use client";

import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code, Italic, List, ListOrdered, Redo, Underline as UnderlineIcon, Undo } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EssayEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    minHeight?: string;
}

export function EssayEditor({
    value = "",
    onChange,
    placeholder = "Nhập câu trả lời tự luận của bạn tại đây...",
    disabled = false,
    className,
    minHeight = "240px",
}: EssayEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose max-w-none focus:outline-none p-4 text-gray-900 leading-relaxed text-sm font-sans",
                style: `min-height: ${minHeight}`,
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div
            className={cn(
                "rounded-xl border border-gray-300 bg-white shadow-sm transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20",
                className,
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 rounded-t-xl border-b border-gray-200 bg-gray-50/70 p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    className={cn(
                        "cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900",
                        editor.isActive("bold") && "bg-brand-100 font-bold text-brand-700",
                    )}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    className={cn(
                        "cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900",
                        editor.isActive("italic") && "bg-brand-100 text-brand-700",
                    )}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={disabled}
                    className={cn(
                        "cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900",
                        editor.isActive("underline") && "bg-brand-100 text-brand-700",
                    )}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </button>

                <div className="mx-1 h-4 w-px bg-gray-300" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                    className={cn(
                        "cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900",
                        editor.isActive("bulletList") && "bg-brand-100 text-brand-700",
                    )}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                    className={cn(
                        "cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900",
                        editor.isActive("orderedList") && "bg-brand-100 text-brand-700",
                    )}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    disabled={disabled}
                    className={cn(
                        "cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900",
                        editor.isActive("codeBlock") && "bg-brand-100 text-brand-700",
                    )}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </button>

                <div className="mx-1 h-4 w-px bg-gray-300" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().undo()}
                    className="cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().redo()}
                    className="cursor-pointer rounded p-1.5 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </button>
            </div>

            {/* Content Area */}
            <EditorContent editor={editor} />
        </div>
    );
}
