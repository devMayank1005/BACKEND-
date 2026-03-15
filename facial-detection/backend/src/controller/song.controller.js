const songModel = require("../model/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

const ALLOWED_MOODS = ["happy", "sad", "surprised", "angry", "neutral"];
const DEFAULT_SONG_LIMIT = 10;
const MAX_SONG_LIMIT = 20;

const normalizeMood = (mood) => (mood || "").toString().trim().toLowerCase();

async function getSongsByMood(mood, limit) {
    return songModel.find({ mood }).limit(limit);
}

async function uploadSong(req, res) {
    try {
        const songBuffer = req.file?.buffer;
        const mood = normalizeMood(req.body?.mood);

        if (!songBuffer) {
            return res.status(400).json({ message: "No song file uploaded" });
        }

        if (!ALLOWED_MOODS.includes(mood)) {
            return res.status(400).json({
                message: `Invalid mood. Allowed moods: ${ALLOWED_MOODS.join(", ")}`,
            });
        }

        // Read ID3 tags
        const tags = id3.read(songBuffer);
        const title = tags.title || req.file.originalname;

        // Prepare poster upload only if image exists
        const posterUpload = tags.image?.imageBuffer
            ? storageService.uploadFile({
                  buffer: tags.image.imageBuffer,
                  filename: `${title}.jpeg`,
                  folder: "/cohort-2/moodify/posters",
              })
            : null;

        // Upload song
        const songUpload = storageService.uploadFile({
            buffer: songBuffer,
            filename: `${title}.mp3`,
            folder: "/cohort-2/moodify/songs",
        });

        // Run uploads in parallel
        const [songFile, posterFile] = await Promise.all([songUpload, posterUpload]);

        if (!songFile?.url) {
            return res.status(500).json({ message: "Failed to upload song file" });
        }

        // Save to database
        const song = await songModel.create({
            title,
            url: songFile.url,
            posterUrl: posterFile?.url || null,
            mood,
        });

        res.status(201).json({
            message: "Song created successfully",
            song,
        });
    } catch (error) {
        console.error("UploadSong error:", error);
        res.status(500).json({ message: "Error uploading song", error: error.message });
    }
}

async function getSong(req, res) {
    try {
        const requestedMood = normalizeMood(req.query?.mood);
        const requestedLimit = Number.parseInt(req.query?.limit, 10);
        const limit = Number.isFinite(requestedLimit)
            ? Math.min(Math.max(requestedLimit, 1), MAX_SONG_LIMIT)
            : DEFAULT_SONG_LIMIT;

        if (!requestedMood) {
            return res.status(400).json({ message: "Mood query parameter is required" });
        }

        if (!ALLOWED_MOODS.includes(requestedMood)) {
            return res.status(400).json({
                message: `Invalid mood. Allowed moods: ${ALLOWED_MOODS.join(", ")}`,
            });
        }

        let servedMood = requestedMood;
        let songs = await getSongsByMood(requestedMood, limit);

        if (!songs.length && requestedMood !== "neutral") {
            servedMood = "neutral";
            songs = await getSongsByMood("neutral", limit);
        }

        if (!songs.length) {
            return res.status(404).json({
                message: "No song found for requested mood or neutral fallback",
                requestedMood,
            });
        }

        const song = songs[Math.floor(Math.random() * songs.length)];

        res.status(200).json({
            message: "Song fetched successfully",
            requestedMood,
            servedMood,
            song,
            songs,
        });
    } catch (error) {
        console.error("GetSong error:", error);
        res.status(500).json({ message: "Error fetching song", error: error.message });
    }
}

module.exports = { uploadSong, getSong };