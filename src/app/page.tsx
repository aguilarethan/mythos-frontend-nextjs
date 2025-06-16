"use client";

import { useState } from "react";
import { dotnetApi } from "@/lib/api/dotnet-api"; // ajusta la ruta a donde esté tu instancia

export default function HomePage() {
  const [message, setMessage] = useState("");

  const handleCheckAuth = async () => {
    try {
      const response = await dotnetApi.get("/auth");
      setMessage(response.data);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Not authenticated");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-4xl font-bold">Welcome to Mythos</h1>
      <button
        onClick={handleCheckAuth}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Check Authentication
      </button>
      {message && <p className="mt-4 text-lg text-gray-700">{message}</p>}
    </div>
  );
}
