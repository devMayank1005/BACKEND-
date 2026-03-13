
import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

export const init = async ({videoRef, landmarkerRef,streamRef}) => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        }
      );
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = streamRef.current;
      try {
        await videoRef.current.play();
        // Wait for video metadata to load before starting detection
        videoRef.current.addEventListener('loadeddata', () => {
          detect();
        }, { once: true });
      } catch (error) {
        console.log("Video play error:", error);
        // Wait for video metadata to load even if play fails
        videoRef.current.addEventListener('loadeddata', () => {
          detect();
        }, { once: true });
      }
    };

export const detect = ({videoRef, landmarkerRef,setExpression}) => {
      if (!landmarkerRef.current || !videoRef.current) return;
      // Ensure video has valid dimensions
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        console.log("Video dimensions not ready:", videoRef.current.videoWidth, videoRef.current.videoHeight);
        return;
      }
      const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      console.log(results);
      
      if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;
        const getScore = (name) =>
          blendshapes.find((b) => b.categoryName === name)?.score || 0;
        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        
        let currentExpression = "Neutral";
        if (smileLeft > 0.5 && smileRight > 0.5) {
          currentExpression = "Happy";
        } else if (jawOpen > 0.6 && browUp > 0.5) {
          currentExpression = "Surprised";
        } else if (frownLeft > 0.5 && frownRight > 0.5) {
          currentExpression = "Sad";
        }
        setExpression(currentExpression);
      }
      animationRef.current = requestAnimationFrame(detect);
    };