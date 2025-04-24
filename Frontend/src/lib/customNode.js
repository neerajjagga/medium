import { Node } from "@tiptap/core";

const VideoEmbed = Node.create({
  name: "videoEmbed",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      {
        ...HTMLAttributes,
        width: "100%",
        height: "315",
        frameborder: "0",
        allowfullscreen: "true",
      },
    ];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const container = document.createElement("div");
      container.classList.add(
        "relative",
        "border",
        "border-gray-300",
        "p-4",
        "rounded-md"
      );

      if (!node.attrs.src) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder =
          "Paste a YouTube, Vimeo, or other link and press enter";
        input.className = "border-none w-full focus:outline-none";

        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            const url = input.value.trim();
            if (url) {
              editor.commands.setNode("videoEmbed", { src: url });
            }
          }
        });

        container.appendChild(input);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = node.attrs.src;
        iframe.width = "100%";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
      }

      return {
        dom: container,
      };
    };
  },
  // Command to insert a video
  addCommands() {
    return {
      insertVideoEmbed:
        (url) =>
        ({ commands }) => {
          if (url) {
            return commands.insertContent({
              type: this.name,
              attrs: { src: url },
            });
          }
          return false;
        },
    };
  },
});

export default VideoEmbed;
