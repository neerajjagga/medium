import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create((set, get) => ({
  profileData: null,
  isGettingProfile: false,
  isProfileFetched: false,

  blogs: [],
  isGettingBlogs: false,
  allBlogsFetched: false,
  message: null,

  users: [],
  isGettingUsers: false,
  isUsersFetched: false,
  allUsersFetched: false,

  isUpdatingProfile: false,

  setProfileData: (data) => set({ profileData: data }),
  setIsProfileFetched: (value) => set({ isProfileFetched: value }),

  setBlogs: (data) => set({ blogs: data }),
  setAllBlogsFetched: (value) => set({ allBlogsFetched: value }),

  setUsers: (data) => set({ users: data }),
  setIsUsersFetched: (value) => set({ isUsersFetched: value }),
  setAllUsersFetched: (value) => set({ allUsersFetched: value }),

  getProfile: async (username) => {
    set({ isGettingProfile: true });
    try {
      const res = await axiosInstance.get(`/profile/${username}`);
      set({ profileData: res.data.user, isProfileFetched: true });
    } catch (error) {
      if (error.response.status !== 403) {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isGettingProfile: false });
    }
  },

  followUser: async (username) => {
    try {
      const res = await axiosInstance.post(`/connections/follow/${username}`);
      useAuthStore.getState().setAuthUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  },

  unfollowUser: async (username) => {
    try {
      const res = await axiosInstance.post(`/connections/unfollow/${username}`);
      useAuthStore.getState().setAuthUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
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
        });
      }

      set({
        blogs: [...get().blogs, ...res.data.blogs],
        allBlogsFetched: res.data.allBlogsFetched,
        isBlogsFetched: true,
        message: res.data.message,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      if (page === 1) {
        set({ isGettingBlogs: false });
      }
    }
  },

  getConnectionUsers: async (type, username, page, limit = 10) => {
    if (get().allUsersFetched) {
      return;
    }

    if (page === 1) {
      set({ isGettingUsers: true });
    }
    try {
      const res = await axiosInstance.get(
        `/profile/${username}/${type}?page=${page}&limit=${limit}`
      );
      set({
        users: [...get().users, ...res.data.users],
        allUsersFetched: res.data.allUsersFetched,
        isUsersFetched: true,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      if (page === 1) {
        set({ isGettingUsers: false });
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/profile/edit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      useAuthStore.getState().setAuthUser(res.data.user);
      toast.success("Profile Updated Successfully!");
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
