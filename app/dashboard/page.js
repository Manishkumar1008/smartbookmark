"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddBookmark from "../components/AddBookmark";
import BookmarkList from "../components/BookmarkList";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Check authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/";
      } else {
        setUser(data.user);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  // 🔹 Fetch bookmarks + Realtime
  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
    };

    fetchBookmarks();

    // 🔥 Realtime listener
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          }

          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? payload.new : b
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🔹 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-500 px-4 py-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-lg text-black">
              Smart Bookmarks
            </h2>
            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <AddBookmark user={user} />
        </div>

        {/* Bookmark List */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <BookmarkList bookmarks={bookmarks} />
        </div>

      </div>
    </div>
  );
}
