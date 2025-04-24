import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import BubbleMenu from "./BubbleMenu";
import FloatingMenu from "./FloatingMenu";
import Placeholder from "@tiptap/extension-placeholder";
import VideoEmbed from "../../lib/customNode";

const lowlight = createLowlight(common);

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3, 4], // Set heading levels 3 and 4
        },
      }),
      Image.configure({
        inline: false,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
      Typography,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      VideoEmbed,
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none outline-none",
      },
    },
    onUpdate: ({ editor }) => {},
  });

  if (!editor) return null;

  return (
    <div className="relative bg-white">
      <BubbleMenu editor={editor} />
      {/* <FloatingMenu editor={editor} /> */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
