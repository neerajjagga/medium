import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // Ensure authentication check runs on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Display loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Redirect unauthenticated users only when necessary
  const protectedRoute = (element) =>
    authUser ? (
      authUser.isSelectedTopics ? (
        element
      ) : (
        <Navigate to="/welcome" />
      )
    ) : (
      <Navigate to="/welcome" state={{ from: location }} />
    );

    
  return (
    <>
      <Routes>
        {/* Home route */}
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

        {/* Public routes */}
        <Route
          path="/welcome"
          element={
            !authUser ? (
              <WelcomePage />
            ) : location.state ? (
              <Navigate to={location.state.from.pathname} />
            ) : (
              <Navigate to="/" />
            )
          }
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

        {/* Authenticated routes */}
        <Route path="/new-story" element={protectedRoute(<NewStory />)} />
        <Route
          path="/me/notifications"
          element={protectedRoute(<NotificationsPage />)}
        />
        <Route
          path="/explore-topics"
          element={protectedRoute(<ExploreTopicsPage />)}
        />
        <Route
          path="/:username/:titleSlug"
          element={protectedRoute(<BlogDetailsPage />)}
        />
        <Route path="/:username" element={protectedRoute(<ProfilePage />)} />
      </Routes>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
