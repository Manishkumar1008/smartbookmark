"use client";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkList({ bookmarks }) {

  const remove = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  if (bookmarks.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No bookmarks yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition"
        >
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate"
          >
            {b.title}
          </a>

          <button
            onClick={() => remove(b.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
