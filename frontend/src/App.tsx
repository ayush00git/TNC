import ChatInterface from "./Pages/ChatInterface";
import JoinActiveRoom from "./Pages/JoinActiveRoom";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyEmail from "./Pages/VerifyEmail";
import ResetPassword from "./Pages/ResetPassword";
import HomePage from "./Pages/HomePage";
import { useEffect, useState } from "react";
import { useGlobalNotifications } from "./hooks/useGlobalNotifications";
import BlogsPage from "./Pages/BlogsPage";
import WriteBlog from "./Pages/WriteBlog";
import ReadBlog from "./Pages/ReadBlog";
import MyBlogsPage from "./Pages/MyBlogsPage";
import EditBlog from "./Pages/EditBlog";
import PostFeature from "./Pages/PostFeature";


function App() {
  const [currentUser, setCurrentUser] = useState<{ _id: string } | null>(null);
  const { setCurrentRoom } = useGlobalNotifications(currentUser?._id || null);

  // Load current user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrentUser({ _id: parsed._id });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/join-room" element={<JoinActiveRoom />} />
        <Route path="/room" element={<ChatInterface setCurrentRoom={setCurrentRoom} />} />
        <Route path="/room/:roomId" element={<ChatInterface setCurrentRoom={setCurrentRoom} />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:blogId" element={<ReadBlog />} />
        <Route path="/my-blogs" element={<MyBlogsPage />} />
        <Route path="/write-blog" element={<WriteBlog />} />
        <Route path="/edit-blog/:blogId" element={<EditBlog />} />
        <Route path="/post-project" element={<PostFeature />} />
      </Routes>

    </>
  );
}

export default App;
