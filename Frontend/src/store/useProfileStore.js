import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useProfileStore = create((set, get) => ({
  profileData: null,
  isGettingProfile: false,
  isProfileFetched: false,

  blogs: [],
  isGettingBlogs: false,
  isBlogsFetched: false,
  allBlogsFetched: false,
  message: null,

  setIsProfileFetched: (value) => set({ isProfileFetched: value }),

  getProfile: async (username) => {
    set({ isGettingProfile: true });
    try {
      const res = await axiosInstance.get(`/profile${username}`);
      set({ profileData: res.data.user, isProfileFetched: true });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingProfile: false });
    }
  },

  followUser: async (username) => {
    try {
      const res = await axiosInstance.post(`/connections/follow/${username}`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  unfollowUser: async (username) => {
    try {
      const res = await axiosInstance.post(`/connections/unfollow/${username}`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getUserBlogs: async (userId, page, limit = 10) => {
    if (get().allBlogsFetched) {
      return;
    }

    if (page === 1) {
      set({ isGettingBlogs: true });
    }
    try {
      const res = await axiosInstance.get(
        `/blogs/${userId}?page=${page}&limit=${limit}`
      );

      if (!res.data.blogs) {
        return set({
          allBlogsFetched: res.data.allBlogsFetched,
          message: res.data.message,
          isBlogsFetched: true,
        });
      }

      set({
        blogs: [...get().blogs, ...res.data.blogs],
        allBlogsFetched: res.data.allBlogsFetched,
        isBlogsFetched: true,
        message: res.data.message,
      });
    } catch (error) {
    } finally {
      if (page === 1) {
        set({ isGettingBlogs: false });
      }
    }
  },
}));
