import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://medium-bjhp.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
