import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getSongByMood(mood) {
  return getSongsByMood(mood);
}

export async function getSongsByMood(mood, options = {}) {
  const normalizedMood = (mood || "").toString().trim().toLowerCase();
  const limit = Number.isFinite(options.limit) ? options.limit : 10;

  if (!normalizedMood) {
    throw new Error("Mood is required to fetch a song");
  }

  try {
    const response = await api.get("/songs", {
      params: {
        mood: normalizedMood,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching song:", error);
    throw error.response?.data ?? error;
  }
}