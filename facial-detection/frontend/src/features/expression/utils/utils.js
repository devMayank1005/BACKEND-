
import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

const HISTORY_SIZE = 12;
const FEATURE_HISTORY_SIZE = 8;
const BASELINE_FRAME_COUNT = 20;

const FEATURE_NAMES = [
  "smile",
  "frown",
  "cheekSquint",
  "eyeSquint",
  "eyeWide",
  "browOuterUp",
  "browDown",
  "mouthPress",
  "mouthStretch",
  "jawOpen",
  "browInnerUp",
  "noseSneer"
];

const getAverage = (values) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const averageFeatureObjects = (items) => {
  if (!items.length) {
    return Object.fromEntries(FEATURE_NAMES.map((name) => [name, 0]));
  }

  return FEATURE_NAMES.reduce((averages, name) => {
    averages[name] = getAverage(items.map((item) => item[name] ?? 0));
    return averages;
  }, {});
};

const createDetectionState = () => ({
  baselineFrames: [],
  baseline: null,
  featureHistory: [],
  moodHistory: []
});

const getDetectionState = (moodHistoryRef) => {
  if (
    !moodHistoryRef.current ||
    Array.isArray(moodHistoryRef.current)
  ) {
    moodHistoryRef.current = createDetectionState();
  }

  return moodHistoryRef.current;
};

const readFeatures = (blendshapes) => {
  const scoreMap = new Map(
    blendshapes.map(({ categoryName, score }) => [categoryName, score])
  );

  const getScore = (name) => scoreMap.get(name) ?? 0;

  return {
    smile: getAverage([
      getScore("mouthSmileLeft"),
      getScore("mouthSmileRight")
    ]),
    frown: getAverage([
      getScore("mouthFrownLeft"),
      getScore("mouthFrownRight")
    ]),
    cheekSquint: getAverage([
      getScore("cheekSquintLeft"),
      getScore("cheekSquintRight")
    ]),
    eyeSquint: getAverage([
      getScore("eyeSquintLeft"),
      getScore("eyeSquintRight")
    ]),
    eyeWide: getAverage([
      getScore("eyeWideLeft"),
      getScore("eyeWideRight"),
      getScore("eyeWideOpenLeft"),
      getScore("eyeWideOpenRight")
    ]),
    browOuterUp: getAverage([
      getScore("browOuterUpLeft"),
      getScore("browOuterUpRight")
    ]),
    browDown: getAverage([
      getScore("browDownLeft"),
      getScore("browDownRight")
    ]),
    mouthPress: getAverage([
      getScore("mouthPressLeft"),
      getScore("mouthPressRight")
    ]),
    mouthStretch: getAverage([
      getScore("mouthStretchLeft"),
      getScore("mouthStretchRight")
    ]),
    jawOpen: getScore("jawOpen"),
    browInnerUp: getScore("browInnerUp"),
    noseSneer: getAverage([
      getScore("noseSneerLeft"),
      getScore("noseSneerRight")
    ])
  };
};

const getActiveFeatures = (features, baseline) => {
  return FEATURE_NAMES.reduce((activeFeatures, name) => {
    const baselineValue = baseline?.[name] ?? 0;
    activeFeatures[name] = Math.max(0, features[name] - baselineValue);
    return activeFeatures;
  }, {});
};

const resolveMood = (features, baseline) => {
  const active = getActiveFeatures(features, baseline);
  const activeBrowRaise = Math.max(active.browInnerUp, active.browOuterUp);
  const surpriseFaceOpen = active.eyeWide + active.jawOpen;
  const angryUpperFace = active.browDown + active.eyeSquint + active.noseSneer;

  const moods = {
    Happy:
      active.smile * 1.35 +
      active.cheekSquint * 0.55 +
      active.eyeSquint * 0.2 -
      active.frown * 0.75 -
      active.mouthPress * 0.2,
    Surprised:
      active.jawOpen * 1.05 +
      active.eyeWide * 1 +
      activeBrowRaise * 0.9 +
      active.mouthStretch * 0.22 -
      active.eyeSquint * 0.35 -
      active.browDown * 0.25,
    Sad:
      active.frown * 1 +
      active.browInnerUp * 0.55 +
      active.mouthPress * 0.35 -
      active.smile * 0.8,
    Angry:
      active.browDown * 1.25 +
      active.eyeSquint * 0.9 +
      active.noseSneer * 1.1 +
      active.mouthPress * 0.4 +
      active.mouthStretch * 0.15 -
      active.jawOpen * 0.3 -
      active.smile * 1,
    Neutral:
      0.28 +
      Math.max(0, 0.16 - active.smile) +
      Math.max(0, 0.12 - active.frown) +
      Math.max(0, 0.14 - active.jawOpen)
  };

  const meetsExpressionGate = {
    Happy:
      active.smile > 0.12 &&
      features.smile > (baseline?.smile ?? 0) + 0.1 &&
      active.smile > active.frown + 0.06,
    Surprised:
      active.jawOpen > 0.09 &&
      active.eyeWide > 0.05 &&
      activeBrowRaise > 0.04 &&
      surpriseFaceOpen > 0.2 &&
      active.eyeSquint < 0.09,
    Sad:
      active.frown > 0.08 &&
      active.smile < 0.05 &&
      active.browInnerUp > 0.02,
    Angry:
      angryUpperFace > 0.21 &&
      active.browDown > 0.06 &&
      active.eyeSquint > 0.05 &&
      (active.noseSneer > 0.025 || active.mouthPress > 0.035) &&
      active.smile < 0.06 &&
      activeBrowRaise < 0.09
  };

  const rankedMoods = Object.entries(moods).sort((firstMood, secondMood) => {
    return secondMood[1] - firstMood[1];
  });

  const [topMood, topScore] = rankedMoods[0];
  const [, secondScore = 0] = rankedMoods[1] ?? [];

  if (topMood !== "Neutral" && !meetsExpressionGate[topMood]) {
    return "Neutral";
  }

  if (topScore < 0.2 || topScore - secondScore < 0.02) {
    return "Neutral";
  }

  return topMood;
};

const queueNextFrame = (params) => {
  const { animationRef } = params;

  animationRef.current = requestAnimationFrame(() => {
    detect(params);
  });
};

export const init = async ({
  videoRef,
  landmarkerRef,
  streamRef,
  animationRef,
  moodHistoryRef,
  setExpression
}) => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
    });

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });

    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();
    moodHistoryRef.current = createDetectionState();
    setExpression("Calibrating...");
    queueNextFrame({
      videoRef,
      landmarkerRef,
      animationRef,
      moodHistoryRef,
      setExpression
    });
  } catch (error) {
    setExpression("Camera access failed");
    console.error("Face detection init error:", error);
  }
};

export const detect = ({
  videoRef,
  landmarkerRef,
  animationRef,
  moodHistoryRef,
  setExpression
}) => {
  if (!landmarkerRef.current || !videoRef.current) {
    return;
  }

  if (
    videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    videoRef.current.videoWidth === 0 ||
    videoRef.current.videoHeight === 0
  ) {
    queueNextFrame({
      videoRef,
      landmarkerRef,
      animationRef,
      moodHistoryRef,
      setExpression
    });
    return;
  }

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (!results.faceBlendshapes?.length) {
    moodHistoryRef.current = createDetectionState();
    setExpression("No face detected");
    queueNextFrame({
      videoRef,
      landmarkerRef,
      animationRef,
      moodHistoryRef,
      setExpression
    });
    return;
  }

  const detectionState = getDetectionState(moodHistoryRef);
  const currentFeatures = readFeatures(results.faceBlendshapes[0].categories);

  if (detectionState.baselineFrames.length < BASELINE_FRAME_COUNT) {
    detectionState.baselineFrames = [
      ...detectionState.baselineFrames,
      currentFeatures
    ];
    detectionState.baseline = averageFeatureObjects(detectionState.baselineFrames);
    setExpression("Calibrating...");
    queueNextFrame({
      videoRef,
      landmarkerRef,
      animationRef,
      moodHistoryRef,
      setExpression
    });
    return;
  }

  detectionState.featureHistory = [
    ...detectionState.featureHistory,
    currentFeatures
  ].slice(-FEATURE_HISTORY_SIZE);

  const smoothedFeatures = averageFeatureObjects(detectionState.featureHistory);
  const currentMood = resolveMood(smoothedFeatures, detectionState.baseline);

  detectionState.moodHistory = [...detectionState.moodHistory, currentMood].slice(
    -HISTORY_SIZE
  );

  const moodCounts = detectionState.moodHistory.reduce((counts, mood) => {
    counts[mood] = (counts[mood] ?? 0) + 1;
    return counts;
  }, {});

  const stableMood = Object.entries(moodCounts).sort((firstMood, secondMood) => {
    return secondMood[1] - firstMood[1];
  })[0]?.[0] ?? currentMood;

  setExpression(stableMood);
  queueNextFrame({
    videoRef,
    landmarkerRef,
    animationRef,
    moodHistoryRef,
    setExpression
  });
};