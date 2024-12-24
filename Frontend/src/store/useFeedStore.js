import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useFeedStore = create((set, get) => ({
  blogs: [],
  isGettingFeeds: false,
  allBlogsFetched: false,
  message: "",

  setBlogs: (data) => set({ blogs: data }),
  setIsAllBlogsFetched: (value) => set({ allBlogsFetched: value }),

  getForYouFeeds: async (page = 1, limit = 10) => {
    if (get().allBlogsFetched) {
      return;
    }

    if (page === 1) {
      set({ isGettingFeeds: true });
    }
    try {
      const res = await axiosInstance.get(
        `/feed/for-you?page=${page}&limit=${limit}`
      );

      console.log(res.data);
      if (!res.data.blogs) {
        return set({ message: res.data.message });
      }

      set({
        blogs: [...res.data.blogs, ...get().blogs],
        allBlogsFetched: res.data.allBlogsFetched,
        message: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      if (page === 1) {
        set({ isGettingFeeds: false });
      }
    }
  },

  getTopicRelatedFeeds: async (type, topic, page = 1, limit = 10) => {
    if (get().allBlogsFetched) {
      return;
    }

    if (page === 1) {
      set({ isGettingFeeds: true });
    }
    try {
      const res = await axiosInstance.get(
        `feed/?type=${type}&tag=${topic}&page=${page}&limit=${limit}`
      );

      console.log(res.data);
      if (!res.data.blogs) {
        return set({ message: res.data.message });
      }

      set({
        blogs: [...res.data.blogs, ...get().blogs],
        allBlogsFetched: res.data.allBlogsFetched,
        message: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      if (page === 1) {
        set({ isGettingFeeds: false });
      }
    }
  },
}));
