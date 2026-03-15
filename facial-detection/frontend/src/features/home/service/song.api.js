import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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