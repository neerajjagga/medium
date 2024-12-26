import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useProfileStore = create((set) => ({
  profileData: null,
  isGettingProfile: false,
  isProfileFetched: false,

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
}));
