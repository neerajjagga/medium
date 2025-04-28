import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useBlogStore = create((set) => ({
  isCreatingBlog: false,
  blog: null,
  isBlogFetched: false,

  createNewBlog: async (data) => {
    set({ isCreatingBlog: true });
    try {
      const res = await axiosInstance.post("/blogs/createblog", data);
      return res.data.blog;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingBlog: false });
    }
  },

  getSingleBlog: async (username, titleSlug) => {
    try {
      const res = await axiosInstance.get(`/blogs/${username}/${titleSlug}`);
      set({ blog: res.data.blog, isBlogFetched: true });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
