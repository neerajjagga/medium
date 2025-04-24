import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react";
import { Image, Plus, X, Video } from "lucide-react";
import { useEffect, useState } from "react";

const FloatingMenu = ({ editor }) => {
  if (!editor) return null;

  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (!showIcons) {
      editor.commands.focus();
    }
  }, [showIcons]);

  return (
    <TiptapFloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { selection } = state;
        const { $anchor, empty } = selection;
        const isEmptyTextBlock =
          $anchor.parent.isTextblock && !$anchor.parent.textContent;

        return empty && isEmptyTextBlock;
      }}
      className="flex gap-4 items-center relative lg:-left-[3.75rem]"
    >
      <button
        className="p-2 flex items-center justify-center rounded-full border border-black bg-white"
        type="button"
        onClick={() => setShowIcons((prev) => !prev)}
      >
        {showIcons ? (
          <X className="size-5" absoluteStrokeWidth={true} size={32} />
        ) : (
          <Plus className="size-5" absoluteStrokeWidth={true} size={32} />
        )}
      </button>
      {showIcons && (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              
            }}
            className={
              "bg-white text-green-600 border-solid border-[1px] border-green-600 rounded-full p-2 hover:bg-gray-200"
            }
          >
            <Image className="size-4" />
          </button>
          {/* <button
            type="button"
            className="bg-white text-green-600 border-solid border-[1px] border-green-600 rounded-full p-2 hover:bg-gray-200"
            onClick={handleVideoEmbed}
          >
            <Video className="size-4" />
          </button> */}
        </div>
      )}
    </TiptapFloatingMenu>
  );
};

export default FloatingMenu;
