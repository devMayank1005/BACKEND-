import React, { useCallback, useState } from "react";
import FaceExpression from "../../expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
import "./home-page.scss";

const MOOD_PLAYLIST_EMBED_URLS = {
  happy: "https://open.spotify.com/embed/playlist/37i9dQZF1DWTwbZHrJRIgD?utm_source=generator",
  sad: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdFesNN9TzXT?utm_source=generator",
  angry: "https://open.spotify.com/embed/playlist/0N7bTAuO8ejUjW2YkyZfRB?utm_source=generator",
  surprised: "https://open.spotify.com/embed/playlist/1rpHTgLGdo1WCl8fjAbe9j?utm_source=generator",
  neutral: "https://open.spotify.com/embed/playlist/7EClwmhqu7mg4JvUI9z5DT?utm_source=generator"
};

const HomePage = () => {
  const { loading, error, song, songs, fetchSongsByMood, selectSong } = useSong();
  const [lockedCapture, setLockedCapture] = useState(null);

  const handleMoodStable = useCallback(
    (payload) => {
      if (!payload?.mood) {
        setLockedCapture(null);
        return;
      }

      setLockedCapture(payload);
      fetchSongsByMood(payload.mood);
    },
    [fetchSongsByMood]
  );

  const normalizedLockedMood = lockedCapture?.mood?.toString().trim().toLowerCase();
  const playlistUrl = normalizedLockedMood
    ? MOOD_PLAYLIST_EMBED_URLS[normalizedLockedMood]
    : null;

  return (
    <div className="home-page">
      <section className="home-page__hero" aria-label="Mood detection layout">
        <div className="home-page__column home-page__column--playlist">
          <div className="home-page__section-label" aria-hidden="true">
            <span className="home-page__section-icon">PL</span>
            <span className="home-page__section-text">Playlist</span>
          </div>

          {playlistUrl ? (
            <section className="mood-playlist" aria-label="Mood playlist">
              <div className="mood-playlist__header">
                <h2 className="mood-playlist__title">Your mood playlist</h2>
                <p className="mood-playlist__subtext">
                  Curated Spotify picks for your locked {normalizedLockedMood} mood.
                </p>
              </div>

              <div className="mood-playlist__frame">
                <iframe
                  title={`Spotify playlist for ${normalizedLockedMood} mood`}
                  src={playlistUrl}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </section>
          ) : (
            <section className="mood-playlist mood-playlist--empty" aria-label="Mood playlist placeholder">
              <p className="mood-playlist__empty-title">No playlist yet</p>
              <p className="mood-playlist__empty-copy">
                Lock a mood to load the matching Spotify playlist here.
              </p>
            </section>
          )}
        </div>

        <div className="home-page__column home-page__column--detector">
          <div className="home-page__section-label" aria-hidden="true">
            <span className="home-page__section-icon">DT</span>
            <span className="home-page__section-text">Detection</span>
          </div>

          <div className="home-page__detector">
            <FaceExpression onMoodStable={handleMoodStable} />
          </div>
        </div>

        <div className="home-page__column home-page__column--lock">
          <div className="home-page__section-label" aria-hidden="true">
            <span className="home-page__section-icon">LK</span>
            <span className="home-page__section-text">Locked Mood</span>
          </div>

          {lockedCapture ? (
            <section className="mood-lock-card" aria-label="Locked mood summary">
              {lockedCapture.imageDataUrl ? (
                <img
                  className="mood-lock-card__image"
                  src={lockedCapture.imageDataUrl}
                  alt="Captured mood"
                />
              ) : null}

              <div className="mood-lock-card__meta">
                <p className="mood-lock-card__title">Mood Locked</p>
                <p className="mood-lock-card__mood">{lockedCapture.mood}</p>
                <p className="mood-lock-card__hint">
                  This snapshot stays active until you detect and lock a new mood.
                </p>
            </div>
            </section>
          ) : (
            <section className="mood-lock-card mood-lock-card--empty" aria-label="Locked mood placeholder">
              <p className="mood-lock-card__empty-title">No mood locked</p>
              <p className="mood-lock-card__empty-copy">
                Your captured mood image and mood summary will appear here after lock.
              </p>
            </section>
          )}
        </div>
      </section>

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
