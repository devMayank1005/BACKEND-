const songModel = require("../model/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

async function uploadSong(req, res) {
    try {
        const songBuffer = req.file?.buffer;
        const { mood } = req.body;

        if (!songBuffer) {
            return res.status(400).json({ message: "No song file uploaded" });
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
        const { mood } = req.query;

        if (!mood) {
            return res.status(400).json({ message: "Mood query parameter is required" });
        }

        const song = await songModel.findOne({ mood });

        if (!song) {
            return res.status(404).json({ message: "No song found for this mood" });
        }

        res.status(200).json({
            message: "Song fetched successfully",
            song,
        });
    } catch (error) {
        console.error("GetSong error:", error);
        res.status(500).json({ message: "Error fetching song", error: error.message });
    }
}

module.exports = { uploadSong, getSong };