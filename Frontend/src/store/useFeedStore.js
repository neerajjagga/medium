import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useFeedStore = create((set, get) => ({
  blogs: [],
  isGettingFeeds: false,
  message: "",

  setBlogs: (data) => set({blogs: data}),

  getForYouFeeds: async (page = 1, limit = 10) => {
    set({ isGettingFeeds: true });
    try {
      const res = await axiosInstance.get(
        `/feed/for-you?page=${page}&limit=${limit}`
      );

      if (!res.data.blogs.length) {
        return set({ message: "No Blogs found!" });
      }

      set({ blogs: [...res.data.blogs, ...get().blogs], message: "" });

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingFeeds: false });
    }
  },

  getTopicRelatedFeeds: async (type, topic, page = 1, limit = 10) => {
    set({ isGettingFeeds: true });
    try {
      const res = await axiosInstance.get(
        `feed/?type=${type}&tag=${topic}&page=${page}&limit=${limit}`
      );

      if (!res.data.blogs) {
        return set({ message: res.data.message, blogs: [] });
      }

      set({ blogs: [...res.data.blogs, ...get().blogs], message: "" });

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingFeeds: false });
    }
  },
}));
