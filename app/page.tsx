"use client";

import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Home() {

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        window.location.href = "/dashboard";
      }
    };
    checkUser();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
        queryParams: { prompt: "select_account" }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-500 
 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 text-center">

        <h1 className="text-2xl font-bold mb-2 text-black">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 mb-6 text-sm">
          Save and manage your favorite links securely
        </p>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Continue with Google
        </button>

        {/* <p className="text-xs text-gray-400 mt-6">
          Secure login powered by Supabase
        </p> */}

      </div>
    </div>
  );
}
