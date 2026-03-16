import React, { useEffect, useRef, useState } from "react";
import { init, detect, resetDetectionState } from "../utils/utils";
import "./face-expression.scss";

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
  const detectEnabledRef = useRef(true);

  const [expression, setExpression] = useState("Detecting...");
  const [lockedMood, setLockedMood] = useState("");
  const [capturedImage, setCapturedImage] = useState("");

  const normalizedMood = NON_MOOD_STATES.has(expression)
    ? ""
    : expression.toLowerCase();
  const isLocked = Boolean(lockedMood);

  useEffect(() => {
    const currentAnimationRef = animationRef;
    const currentLandmarkerRef = landmarkerRef;
    const currentVideoRef = videoRef;

    init({
      videoRef,
      landmarkerRef,
      streamRef,
      animationRef,
      detectEnabledRef,
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

  const captureCurrentFrame = () => {
    if (!videoRef.current) {
      return "";
    }

    const video = videoRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      return "";
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return "";
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const handleLockMood = () => {
    if (!normalizedMood || isLocked) {
      return;
    }

    const imageDataUrl = captureCurrentFrame();

    detectEnabledRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setLockedMood(normalizedMood);
    setCapturedImage(imageDataUrl);

    if (onMoodStable) {
      onMoodStable({ mood: normalizedMood, imageDataUrl });
    }
  };

  const handleDetectAgain = () => {
    setLockedMood("");
    setCapturedImage("");
    setExpression("Calibrating...");
    resetDetectionState(moodHistoryRef);
    detectEnabledRef.current = true;

    detect({
      videoRef,
      landmarkerRef,
      animationRef,
      detectEnabledRef,
      moodHistoryRef,
      setExpression
    });

    if (onMoodStable) {
      onMoodStable(null);
    }
  };

  const isWarning =
    expression === "No face detected" || expression === "Camera access failed";
  const isLive = Boolean(normalizedMood) && !isLocked;
  const statusText = isLocked ? `Mood locked: ${lockedMood}` : expression;

  const statusClassName = [
    "face-expression__status",
    isLocked ? "face-expression__status--locked" : "",
    isLive ? "face-expression__status--live" : "",
    isWarning ? "face-expression__status--warning" : ""
  ]
    .join(" ")
    .trim();

  const actionClassName = [
    "face-expression__action",
    isLocked ? "face-expression__action--secondary" : ""
  ]
    .join(" ")
    .trim();

  return (
    <div className="face-expression">
      <div className="face-expression__camera-shell">
        <video
          ref={videoRef}
          className="face-expression__video"
          autoPlay
          playsInline
          muted
        />
      </div>

      <p className={statusClassName}>{statusText}</p>
      <p className="face-expression__helper">
        {isLocked
          ? "Mood snapshot saved. Detect again to unlock and recapture."
          : "Hold still for a moment, then lock your detected mood."}
      </p>

      {capturedImage && (
        <div className="face-expression__capture">
          <img
            src={capturedImage}
            alt="Captured mood frame"
            className="face-expression__capture-image"
          />
          <p className="face-expression__capture-label">Captured mood frame</p>
        </div>
      )}

      <div className="face-expression__actions">
        <button
          type="button"
          className={actionClassName}
          onClick={isLocked ? handleDetectAgain : handleLockMood}
          disabled={!isLocked && !normalizedMood}
        >
          {isLocked ? "Detect Mood Again" : "Lock Mood"}
        </button>
      </div>
    </div>
  );
}
