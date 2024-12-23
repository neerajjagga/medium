import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import SelectTagsPage from "./pages/SelectTagsPage";
import NewStory from "./pages/NewStoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import ExploreTopicsPage from "./pages/ExploreTopicsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              !authUser.isSelectedTopics ? (
                <Navigate to="/get-started/topics" />
              ) : (
                <HomePage />
              )
            ) : (
              <Navigate to="/welcome" />
            )
          }
        />
        <Route
          path="/welcome"
          element={!authUser ? <WelcomePage /> : <Navigate to="/" />}
        />
        <Route
          path="/get-started/topics"
          element={
            authUser ? (
              !authUser.isSelectedTopics ? (
                <SelectTagsPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/welcome" />
            )
          }
        />
        <Route
          path="/new-story"
          element={authUser ? <NewStory /> : <Navigate to="/welcome" />}
        />

        <Route
          path="/me/notifications"
          element={authUser ? <NotificationsPage /> : <Navigate to="/welcome" />}
        />

        <Route
          path="/explore-topics"
          element={authUser ? <ExploreTopicsPage /> : <Navigate to="/welcome" />}
        />

        <Route
          path="/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/welcome" />}
        />

        <Route
          path="/:username/:titleSlug"
          element={authUser ? <BlogDetailsPage /> : <Navigate to="/welcome" />}
        />
      </Routes>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
