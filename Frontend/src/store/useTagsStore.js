import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useTagsStore = create((set) => ({
  tags: [],
  isGettingTags: false,
  isSavingTags: false,

  getTags: async () => {
    set({ isGettingTags: true });
    try {
      const res = await axiosInstance.get("/get-started/topics");
      set({ tags: res.data.topicsData });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingTags: false });
    }
  },

  saveTags: async (data) => {
    set({ isSavingTags: true });
    try {
      const res = await axiosInstance.post("/get-started/topics", data);
      const { setAuthUser } = useAuthStore.getState();
      console.log(res.data);
      setAuthUser(res.data.user);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSavingTags: false });
    }
  },
}));
