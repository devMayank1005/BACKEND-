import React, { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

const NON_MOOD_STATES = new Set([
  "Detecting...",
  "Calibrating...",
  "Analyzing...",
  "No face detected",
  "Camera access failed"
]);

export default function FaceExpression({ onMoodStable }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const moodHistoryRef = useRef([]);
  const lastMoodRef = useRef("");

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    const currentAnimationRef = animationRef;
    const currentLandmarkerRef = landmarkerRef;
    const currentVideoRef = videoRef;

    init({
      videoRef,
      landmarkerRef,
      streamRef,
      animationRef,
      moodHistoryRef,
      setExpression
    });

    return () => {
      if (currentAnimationRef.current) {
        cancelAnimationFrame(currentAnimationRef.current);
      }

      if (currentLandmarkerRef.current) {
        currentLandmarkerRef.current.close();
      }

      if (currentVideoRef.current?.srcObject) {
        currentVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!onMoodStable || NON_MOOD_STATES.has(expression)) {
      return;
    }

    const normalizedMood = expression.toLowerCase();

    if (lastMoodRef.current === normalizedMood) {
      return;
    }

    lastMoodRef.current = normalizedMood;
    onMoodStable(normalizedMood);
  }, [expression, onMoodStable]);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "500px", height: "auto" }}
        autoPlay
        playsInline
        muted
      />

      <h2>{expression}</h2>

      <button
        onClick={() =>
          detect({
            videoRef,
            landmarkerRef,
            animationRef,
            moodHistoryRef,
            setExpression
          })
        }
      >
        Detect Expression
      </button>
    </div>
  );
}
