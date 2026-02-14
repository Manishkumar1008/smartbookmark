"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddBookmark({ user }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const addBookmark = async () => {

    // 🔴 Validation
    if (!title.trim() || !url.trim()) {
      setError("Title and URL cannot be empty.");
      return;
    }

    // Optional: basic URL validation
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }

    setError("");

    await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      });

    setTitle("");
    setUrl("");
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 w-1/3"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="border p-2 w-1/2"
        />

        <button
            onClick={addBookmark}
            disabled={!title.trim() || !url.trim()}
            className={`rounded-lg px-3 text-white ${
                !title.trim() || !url.trim()
                ? "bg-gray-400"
                : "bg-blue-500"
            }`}
            >
            Add
        </button>

      </div>

      {/* 🔴 Error message */}
      {error && (
        <p className="text-red-500 mt-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
