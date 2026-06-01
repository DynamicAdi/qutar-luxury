"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo2,
  Redo2,
  ImagePlus,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Send,
} from "lucide-react";

interface BlogEditorData {
  title: string;
  subtitle: string;
  slug: string;
  bannerImage: File | null;
  published: boolean;
  content: Record<string, unknown>;
}

interface EditorProps {
  initialData?: {
    title?: string;
    subtitle?: string;
    slug?: string;
    content?: Record<string, unknown>;
  };

  onSaveDraft?: (data: BlogEditorData) => Promise<void>;
  onPublish?: (data: BlogEditorData) => Promise<void>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function Editor({
  initialData,
  onSaveDraft,
  onPublish,
}: EditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

      Link.configure({
        openOnClick: false,
      }),

      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],

    content: initialData?.content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Start writing...",
            },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    if (!bannerImage) {
      setBannerPreview("");
      return;
    }

    const url = URL.createObjectURL(bannerImage);
    setBannerPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [bannerImage]);

  const handleInsertImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleInlineImageSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !editor) return;

    const blobUrl = URL.createObjectURL(file);

    editor.chain().focus().setImage({ src: blobUrl }).run();

    event.target.value = "";
  };

  const getPayload = (): BlogEditorData => ({
    title,
    subtitle,
    slug,
    bannerImage,
    published: false,
    content: (editor?.getJSON() ?? {}) as Record<string, unknown>,
  });

  const saveDraft = async () => {
    if (!editor) return;

    await onSaveDraft?.({
      ...getPayload(),
      published: false,
    });
  };

  const publish = async () => {
    if (!editor) return;

    await onPublish?.({
      ...getPayload(),
      published: true,
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-5/6 h-auto border-l border-gray-200 flex flex-col">
      {/* Top CTA Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Blog Editor</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={saveDraft}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            <Save size={16} />
            Save Draft
          </button>

          <button
            onClick={publish}
            className="flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2"
          >
            <Send size={16} />
            Publish
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Metadata */}
        <div className="p-6 border-b border-gray-200 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subtitle
            </label>

            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Short description"
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slug
            </label>

            <div className="flex gap-2">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 rounded-lg border px-4 py-3 outline-none"
                placeholder="post-slug"
              />

              <button
                type="button"
                onClick={() => setSlug(slugify(title))}
                className="rounded-lg border px-4"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBannerImage(e.target.files?.[0] ?? null)
              }
            />

            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="mt-4 h-64 w-full rounded-xl object-cover"
              />
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200 p-3 flex flex-wrap gap-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className="p-2 border rounded"
            aria-label="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="p-2 border rounded"
            aria-label="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className="p-2 border rounded"
            aria-label="Heading 3"
          >
            <Heading3 size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            className="p-2 border rounded"
            aria-label="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            className="p-2 border rounded"
            aria-label="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            className="p-2 border rounded"
            aria-label="Underline"
          >
            <UnderlineIcon size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            className="p-2 border rounded"
          >
            <List size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            className="p-2 border rounded"
          >
            <ListOrdered size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
            className="p-2 border rounded"
          >
            <Quote size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
            className="p-2 border rounded"
          >
            <Code2 size={16} />
          </button>

          <button
            onClick={handleInsertImage}
            className="p-2 border rounded"
          >
            <ImagePlus size={16} />
          </button>

          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 border rounded"
          >
            <Undo2 size={16} />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 border rounded"
          >
            <Redo2 size={16} />
          </button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleInlineImageSelected}
          />
        </div>

        {/* Editor */}
<div
  onClick={() => editor?.commands.focus()}
  className="min-h-[400px] p-8 cursor-text"
>
  <EditorContent
    editor={editor}
    className="
      prose
      prose-lg
      max-w-none
      [&_.ProseMirror]:min-h-[500px]
      [&_.ProseMirror]:outline-none
    "
  />
</div>
      </div>
    </div>
  );
}