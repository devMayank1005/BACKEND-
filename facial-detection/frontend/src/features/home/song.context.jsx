/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { getSongsByMood } from "./service/song.api";

export const SongContext = createContext(null);

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchSongsByMood = async (detectedMood) => {
        const normalizedMood = (detectedMood || "").toString().trim().toLowerCase();

        if (!normalizedMood) {
            setError("Mood is required");
            return;
        }

        const moodQueue = normalizedMood === "neutral"
            ? ["neutral"]
            : [normalizedMood, "neutral"];

        setLoading(true);
        setError("");

        try {
            for (const mood of moodQueue) {
                try {
                    const data = await getSongsByMood(mood);

                    if (Array.isArray(data?.songs) && data.songs.length) {
                        const options = data.songs.map((songOption) => ({
                            ...songOption,
                            requestedMood: data.requestedMood,
                            servedMood: data.servedMood,
                        }));

                        setSongs(options);
                        setSong(options[0]);
                        return;
                    }
                } catch (innerError) {
                    if (mood === moodQueue[moodQueue.length - 1]) {
                        throw innerError;
                    }
                }
            }

            throw new Error("No song available for selected mood");
        } catch (fetchError) {
            setSong(null);
            setSongs([]);
            setError(fetchError?.message || "Failed to fetch song");
        } finally {
            setLoading(false);
        }
    };

    const fetchSongByMood = fetchSongsByMood;

    const selectSong = (songId) => {
        const selectedSong = songs.find((songOption) => {
            return String(songOption._id ?? songOption.id) === String(songId);
        });

        if (selectedSong) {
            setSong(selectedSong);
        }
    };

    return (
        <SongContext.Provider
            value={{
                song,
                songs,
                loading,
                error,
                fetchSongByMood,
                fetchSongsByMood,
                selectSong,
            }}
        >
            {children}
        </SongContext.Provider>
    );

};