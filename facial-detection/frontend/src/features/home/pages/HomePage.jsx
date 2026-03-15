import React, { useCallback } from "react";
import FaceExpression from "../../expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
import "./home-page.scss";

const HomePage = () => {
  const { loading, error, song, songs, fetchSongsByMood, selectSong } = useSong();

  const handleMoodStable = useCallback(
    (mood) => {
      fetchSongsByMood(mood);
    },
    [fetchSongsByMood]
  );

  return (
    <div className="home-page">
      <FaceExpression onMoodStable={handleMoodStable} />
      {loading && <p className="home-page__status">Fetching songs...</p>}
      {error && <p className="home-page__status home-page__status--error">{error}</p>}
      {!loading && songs.length > 0 && (
        <section className="song-picker" aria-label="Available songs for current mood">
          <div className="song-picker__header">
            <p className="song-picker__title">
              Available songs <span>({songs.length})</span>
            </p>
            <span className="song-picker__mood-badge">
              Mood: {song?.servedMood || song?.mood}
            </span>
          </div>

          <div className="song-picker__list" role="listbox" aria-label="Song options">
            {songs.map((songOption) => {
              const optionId = songOption._id ?? songOption.id;
              const isActive = String(optionId) === String(song?._id ?? song?.id);

              return (
                <button
                  key={String(optionId)}
                  type="button"
                  onClick={() => selectSong(optionId)}
                  className={`song-picker__item ${isActive ? "song-picker__item--active" : ""}`}
                  aria-selected={isActive}
                >
                  {songOption.posterUrl ? (
                    <img
                      className="song-picker__poster"
                      src={songOption.posterUrl}
                      alt={songOption.title}
                    />
                  ) : (
                    <div className="song-picker__poster song-picker__poster--fallback">
                      {songOption.title?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  )}

                  <span className="song-picker__meta">
                    <strong className="song-picker__song-title">{songOption.title}</strong>
                    <span className="song-picker__song-mood">{songOption.mood}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
      {song && <Player />}
    </div>
  );
};

export default HomePage;
