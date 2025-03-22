import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import * as fp from "fingerpose";
import { aSign, bSign, cSign, dSign } from "../components/handsigns";

// Define the interface for hand predictions based on handpose's documentation.
interface HandPrediction {
  handInViewConfidence: number;
  boundingBox: {
    topLeft: [number, number];
    bottomRight: [number, number];
  };
  landmarks: [number, number, number][];
  annotations: {
    [key: string]: [number, number, number][];
  };
}

const ASLRecognition: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recognizedGesture, setRecognizedGesture] = useState<string>("");

  // Defines finger joints for drawing hand keypoints.
  const fingerJoints: { [key: string]: number[] } = {
    thumb: [0, 1, 2, 3, 4],
    index: [0, 5, 6, 7, 8],
    mid: [0, 9, 10, 11, 12],
    ring: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };

  // Draws hand keypoints and lines on the canvas.
  const drawHand = (predictions: HandPrediction[], ctx: CanvasRenderingContext2D) => {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      // Draw lines for each finger.
      Object.keys(fingerJoints).forEach((finger) => {
        const points = fingerJoints[finger];
        for (let i = 0; i < points.length - 1; i++) {
          const firstJointIndex = points[i];
          const secondJointIndex = points[i + 1];
          ctx.beginPath();
          ctx.moveTo(landmarks[firstJointIndex][0], landmarks[firstJointIndex][1]);
          ctx.lineTo(landmarks[secondJointIndex][0], landmarks[secondJointIndex][1]);
          ctx.strokeStyle = "gold";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw a circle for each landmark.
      landmarks.forEach((landmark) => {
        const [x, y] = landmark;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "navy";
        ctx.fill();
      });
    });
  };

  // Detects the hand, draws landmarks, and uses fingerpose to estimate the gesture.
  const detect = async (model: handpose.HandPose) => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Update video dimensions.
      video.width = videoWidth;
      video.height = videoHeight;

      // Update canvas dimensions.
      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          const predictions: HandPrediction[] = await model.estimateHands(video);
          if (predictions.length > 0) {
            drawHand(predictions, ctx);

            // Convert landmarks from [number, number, number][] to Keypoint3D[] format
            const keypoints = predictions[0].landmarks.map(([x, y, z]) => ({ x, y, z }));

            // Use fingerpose to estimate the gesture from the converted keypoints.
            const GE = new fp.GestureEstimator([
              aSign,
              bSign,
              cSign,
              dSign
            ]);

            // Using a minimum match score of 8.5 (out of 10) as recommended
            const gesture = await GE.estimate(keypoints, 8.5);
            
            // Log the raw pose data for debugging
            console.log("Pose data:", gesture.poseData);
            console.log("Estimated gestures:", gesture.gestures);

            if (gesture.gestures && gesture.gestures.length > 0) {
              // Find the gesture with the highest score
              const scores = gesture.gestures.map((g) => g.score);
              const maxScore = Math.max(...scores);
              const maxGesture = gesture.gestures.find((g) => g.score === maxScore);
              
              // Only set the gesture if the score is high enough
              if (maxScore >= 8.5) {
                setRecognizedGesture(maxGesture?.name || "");
              } else {
                setRecognizedGesture("Not recognized");
              }
            } else {
              setRecognizedGesture("Not recognized");
            }
          } else {
            setRecognizedGesture("No hand detected");
          }
        }
      }
    }
  };

  // Load the handpose model and start detection.
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const runHandpose = async () => {
      const model = await handpose.load();
      console.log("Handpose model loaded.");
      intervalId = setInterval(() => {
        detect(model);
      }, 150);
    };

    runHandpose();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="w-full h-auto"
          videoConstraints={{ facingMode: "user" }}
        />
        {/* Canvas overlay to draw hand landmarks */}
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
      <div className="mt-4">
        <p className="text-xl">
          {recognizedGesture
            ? `Recognized: ${recognizedGesture}`
            : "Waiting for gesture..."}
        </p>
      </div>
    </div>
  );
};

export default ASLRecognition;
