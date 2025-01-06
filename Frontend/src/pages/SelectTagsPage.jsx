import React, { useEffect, useState } from "react";
import { Check, Plus, Loader2, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useTagsStore } from "../store/useTagsStore";
import { deleteArrayElement } from "../lib/utils";

const SelectTagsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  const [limit, setLimit] = useState(50);

  const { tags, isGettingTags, isSavingTags, getTags, saveTags } =
    useTagsStore();

  useEffect(() => {
    getTags();
  }, []);

  const handleClick = (tag) => {
    if (selectedTags.includes(tag)) {
      const modifiedSelectedTagsArray = deleteArrayElement(selectedTags, tag);
      setSelectedTags(modifiedSelectedTagsArray);
    } else {
      setSelectedTags(selectedTags.concat(tag));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTags.length < 3) {
      return toast.error("Select at least 3 topics!");
    }

    saveTags({ selectedInterestedTopics: selectedTags });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="bg-white w-full sticky top-0 border-b-[1px] border-solid  border-black"
        style={{ zIndex: 5 }}
      >
        <div className="flex justify-center items-center px-8 py-4">
          <h2 className="text-4xl">Medium</h2>
        </div>
      </header>
      <main className="flex justify-center items-center flex-grow p-8">
        <div className="w-full flex flex-col items-center gap-5 mt-8 sm:w-3/4 md:max-w-3xl">
          <h2 className="text-3xl text-center">What are you interested in?</h2>
          <p className="font-semibold">Choose three or more</p>

          {/* Select Tags From */}
          {isGettingTags ? (
            <Loader2 className="size-8 animate-spin" />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center gap-5 mt-8"
            >
              <ul className="flex justify-center flex-wrap gap-3">
                {tags.map((tag, index) => {
                  if (index < limit) {
                    return (
                      <li
                        onClick={() => handleClick(tag)}
                        key={index}
                        className={`rounded-3xl flex gap-2 items-center px-4 py-1.5 cursor-pointer ${
                          selectedTags.includes(tag)
                            ? "bg-neutral-800 hover:bg-black"
                            : "bg-neutral-200 hover:bg-neutral-300"
                        }`}
                      >
                        <h4
                          className={`text-[0.85rem] ${
                            selectedTags.includes(tag)
                              ? "text-white"
                              : "text-neutral-900"
                          }`}
                        >
                          {tag}
                        </h4>
                        {selectedTags.includes(tag) ? (
                          <Check className="size-4 text-white" />
                        ) : (
                          <Plus className="size-4 text-neutral-600" />
                        )}
                      </li>
                    );
                  }
                })}
              </ul>
              {limit < tags.length && (
                <button
                  type="button"
                  className="text-base font-semibold text-green-700 mt-2 hover:underline"
                  onClick={() => {
                    setLimit(limit * 2 > tags.length ? tags.length : limit * 2);
                  }}
                >
                  Show more
                </button>
              )}
              <button
                type="submit"
                className={`w-1/3 flex justify-center mt-8 px-4 py-2 ${
                  selectedTags.length < 3
                    ? "bg-neutral-500"
                    : "bg-neutral-800 hover:bg-black"
                } rounded-3xl text-white`}
                disabled={selectedTags.length < 3}
              >
                {isSavingTags ? (
                  <Loader className="size-5 animate-spin" />
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default SelectTagsPage;
