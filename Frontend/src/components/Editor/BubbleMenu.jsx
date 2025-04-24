import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { cn } from "../../lib/utils";
import {
  Bold,
  Italic,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading,
  Code,
  Code2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const BubbleMenu = ({ editor }) => {
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [link, setLink] = useState("");

  const linkInputRef = useRef(null);

  useEffect(() => {
    if (showLinkMenu) {
      linkInputRef.current.focus();
    }
  }, [showLinkMenu]);

  const buttons = [
    {
      label: "Bold",
      icon: Bold,
      action: () => {
        if (
          editor.isActive("heading", { level: 3 }) ||
          editor.isActive("heading", { level: 4 }) ||
          editor.isActive("code") ||
          editor.isActive("codeBlock")
        ) {
          return;
        }
        editor.chain().focus().toggleBold().run();
      },
      isActive: editor.isActive("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => {
        if (
          editor.isActive("heading", { level: 3 }) ||
          editor.isActive("heading", { level: 4 }) ||
          editor.isActive("code") ||
          editor.isActive("codeBlock")
        ) {
          return;
        }
        editor.chain().focus().toggleItalic().run();
      },
      isActive: editor.isActive("italic"),
    },
    {
      label: "Link",
      icon: Link,
      action: () => {
        if (
          editor.isActive("heading", { level: 3 }) ||
          editor.isActive("code") ||
          editor.isActive("codeBlock")
        ) {
          return;
        }
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
        } else {
          setShowLinkMenu(true);
        }
      },
      isActive: editor.isActive("link"),
    },
    {
      label: "Heading 3",
      icon: Heading,
      action: () => {
        if (editor.isActive("code")) {
          editor.chain().focus().toggleCode().run();
        }
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
        }
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      },
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      label: "Heading 4",
      icon: Heading,
      action: () => {
        if (editor.isActive("code")) {
          editor.chain().focus().toggleCode().run();
        }
        editor.chain().focus().toggleHeading({ level: 4 }).run();
      },
      isActive: editor.isActive("heading", { level: 4 }),
    },
    {
      label: "Code",
      icon: Code,
      action: () => {
        if (editor.isActive("heading", { level: 3 })) {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
        if (editor.isActive("heading", { level: 4 })) {
          editor.chain().focus().toggleHeading({ level: 4 }).run();
        }
        editor.chain().focus().toggleCode().run();
      },
      isActive: editor.isActive("code"),
    },
    {
      label: "Code Block",
      icon: Code2,
      action: () => {
        editor.chain().focus().toggleCodeBlock().run();
      },
      isActive: editor.isActive("codeBlock"),
    },
    {
      label: "Align Left",
      icon: AlignLeft,
      action: () => {
        if (editor.isActive("codeBlock")) {
          return;
        }
        editor.chain().focus().setTextAlign("left").run();
      },
      isActive: editor.isActive({ textAlign: "left" }),
    },
    {
      label: "Align Center",
      icon: AlignCenter,
      action: () => {
        if (editor.isActive("codeBlock")) {
          return;
        }
        editor.chain().focus().setTextAlign("center").run();
      },
      isActive: editor.isActive({ textAlign: "center" }),
    },
    {
      label: "Align Right",
      icon: AlignRight,
      action: () => {
        if (editor.isActive("codeBlock")) {
          return;
        }
        editor.chain().focus().setTextAlign("right").run();
      },
      isActive: editor.isActive({ textAlign: "right" }),
    },
  ];

  // Function to validate if the given string is a valid URL
  const isValidUrl = (url) => {
    try {
      new URL(url); // Built-in URL constructor will throw an error for invalid URLs
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isValidUrl(link)) {
        setTimeout(() => {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: link })
            .run();
        }, 30);
      } else {
        toast.error("Enter a valid url!");
      }
      setShowLinkMenu(false);
      setLink("");
    }
  };

  const getButtonClass = (label) => {
    if (
      editor.isActive("heading", { level: 3 }) ||
      editor.isActive("heading", { level: 4 }) ||
      editor.isActive("code") ||
      editor.isActive("codeBlock")
    ) {
      if (label === "Bold" || label === "Italic") return "text-stone-400";
    }
    if (
      editor.isActive("codeBlock") &&
      (label === "Align Left" ||
        label === "Align Right" ||
        label === "Align Center")
    ) {
      return "text-stone-400";
    }
    if (
      (editor.isActive("heading", { level: 3 }) ||
        editor.isActive("code") ||
        editor.isActive("codeBlock")) &&
      label === "Link"
    ) {
      return "text-stone-400";
    }
    return "text-white";
  };

  const addSeparator = (index) => [2, 4, 6].includes(index);

  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "top",
        offset: [0, 10],
        animation: "scale",
      }}
      className="relative flex items-center gap-2.5 rounded-md bg-neutral-800 shadow-md px-2.5 py-3"
    >
      {showLinkMenu && (
        <div className="flex gap-3 items-center justify-between">
          <input
            ref={linkInputRef}
            type="text"
            className="text-sm text-white bg-neutral-800 outline-none rounded-md placeholder:text-stone-400"
            placeholder="Paste or type a link..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={() => {
              setShowLinkMenu(false);
              setLink("");
            }}
            onKeyDown={handleKeyDown}
          />
          <button className="" onClick={() => setShowLinkMenu(false)}>
            <X className="size-4 text-white" />
          </button>
        </div>
      )}
      {!showLinkMenu &&
        buttons.map(({ label, icon: Icon, action, isActive }, index) => (
          <React.Fragment key={label}>
            <button
              type="button"
              onClick={action}
              className={cn(
                getButtonClass(label),
                isActive && "text-green-400"
              )}
              aria-label={label}
              aria-pressed={isActive}
              title={label}
            >
              <Icon
                className={label.includes("Heading 3") ? "size-5" : "size-4"}
              />
            </button>
            {addSeparator(index) && (
              <div className="w-[1px] bg-neutral-500 h-[1.5rem]"></div>
            )}
          </React.Fragment>
        ))}
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
