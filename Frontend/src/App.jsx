import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, Outlet } from "react-router-dom";
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
import ConnectionsPage from "./pages/ConnectionsPage";

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

  const ProtectedRoute = (element ) => {
    const location = useLocation();
  
    if (!authUser) {
      // Pass the current location to the state for future redirection
      return <Navigate to="/welcome" state={{ from: location }} />;
    }
  
    if (!authUser.isSelectedTopics) {
      return <Navigate to="/welcome" />;
    }
  
    // Clone the element and pass the location as a prop
    return React.cloneElement(element, { previousLocation: location });
  };

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
            ) : location.state?.from ? (
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
        <Route path="/new-story" element={ProtectedRoute(<NewStory />)} />
        <Route
          path="/me/notifications"
          element={ProtectedRoute(<NotificationsPage />)}
        />
        <Route
          path="/explore-topics"
          element={ProtectedRoute(<ExploreTopicsPage />)}
        />
        <Route path="/:username" element={ProtectedRoute(<ProfilePage />)} />
        <Route
          path="/:username/following"
          element={ProtectedRoute(<ConnectionsPage />)}
        />
        <Route
          path="/:username/followers"
          element={ProtectedRoute(<ConnectionsPage />)}
        />
        <Route
          path="/:username/:titleSlug"
          element={ProtectedRoute(<BlogDetailsPage />)}
        />
      </Routes>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
