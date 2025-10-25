/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Webcam from "react-webcam";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
/**
 * Hitung jumlah jari yang terangkat dari landmark tangan.
 */
function countExtendedFingers(landmarks: any[]) {
 const idx = landmarks[8].y < landmarks[6].y ? 1 : 0;
 const mid = landmarks[12].y < landmarks[10].y ? 1 : 0;
 const ring = landmarks[16].y < landmarks[14].y ? 1 : 0;
 return idx + mid + ring;
}

/**
 * GestureCamera Component
 * -----------------------
 * - Menyalakan webcam
 * - Mendeteksi pose tangan (1–3 jari)
 * - Setelah mendeteksi 3 jari berturut-turut → otomatis ambil foto
 */
export default function GestureCamera({
 value,
 onCapture,
 onClear,
 required,
}: Readonly<{
 value: string;
 onCapture: (dataUrl: string) => void;
 onClear: () => void;
 required?: boolean;
}>) {
 const webcamRef = React.useRef<Webcam>(null);
 const videoEl = React.useRef<HTMLVideoElement | null>(null);
 const [running, setRunning] = React.useState(false);
 const [count, setCount] = React.useState(0);
 const [streak, setStreak] = React.useState(0);
 const [message, setMessage] = React.useState("Show 1️⃣ then 2️⃣ then 3️⃣");
 const cameraRef = React.useRef<Camera | null>(null);
 const handsRef = React.useRef<Hands | null>(null);
 const capturedOnce = React.useRef(false);

 /**
  * Mulai kamera dan inisialisasi MediaPipe Hands
  */
 const start = async () => {
  setRunning(true);
  const hands = new Hands({
   locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
  });
  hands.setOptions({
   maxNumHands: 1,
   minDetectionConfidence: 0.6,
   minTrackingConfidence: 0.6,
   modelComplexity: 1,
  });
  hands.onResults(onResults);
  handsRef.current = hands;

  const video = webcamRef.current?.video;
  if (!video) return;
  videoEl.current = video;

  const camera = new Camera(video, {
   onFrame: async () => {
    if (!handsRef.current) return;
    await handsRef.current.send({ image: video });
   },
   width: 640,
   height: 480,
  });
  camera.start();
  cameraRef.current = camera;
 };

 /**
  * Hentikan kamera dan reset state
  */
 const stop = () => {
  setRunning(false);
  cameraRef.current?.stop();
  handsRef.current?.close();
  cameraRef.current = null;
  handsRef.current = null;
  setCount(0);
  setStreak(0);
  setMessage("Show 1️⃣ then 2️⃣ then 3️⃣");
  capturedOnce.current = false;
 };

 /**
  * Callback hasil deteksi MediaPipe
  */
 const onResults = (res: Results) => {
  const lm = res.multiHandLandmarks?.[0];
  if (!lm) {
   setCount(0);
   setStreak(0);
   return;
  }

  const c = countExtendedFingers(lm as any[]);
  setCount(c);
  setMessage(c < 3 ? "Detecting..." : "Hold 3 to capture");

  if (c === 3) {
   setStreak((s) => {
    const next = s + 1;
    if (next >= 5 && !capturedOnce.current) {
     const dataUrl = webcamRef.current?.getScreenshot();
     if (dataUrl) {
      onCapture(dataUrl);
      capturedOnce.current = true;
      setMessage("Captured! You can retake if needed.");
      stop();
     }
    }
    return next;
   });
  } else {
   setStreak(0);
  }
 };

 return (
  <div className='flex flex-col gap-2'>
   {value ? (
    <div className='flex items-start gap-3'>
     <img
      src={value}
      alt='Captured'
      className='w-[240px] h-[180px] object-cover rounded-md border border-slate-800'
     />
     <div className='flex flex-col gap-2'>
      <div className='text-xs text-slate-400'>Preview</div>
      <div className='flex gap-2'>
       <button type='button' className='btn btn-base' onClick={onClear}>
        Retake
       </button>
      </div>
     </div>
    </div>
   ) : (
    <div className='relative w-full max-w-[640px]'>
     <Webcam
      ref={webcamRef}
      audio={false}
      screenshotFormat='image/jpeg'
      className='w-full rounded-md border border-slate-800'
      videoConstraints={{ facingMode: "user" }}
     />
     <div className='pointer-events-none absolute inset-0 grid place-items-center text-6xl font-black text-white/90 drop-shadow'>
      {count}
     </div>
    </div>
   )}
   <div className='flex items-center gap-3'>
    {!value && !running && (
     <button type='button' className='btn btn-base' onClick={start}>
      Start Camera
     </button>
    )}
    {!value && running && (
     <button type='button' className='btn btn-danger' onClick={stop}>
      Stop Camera
     </button>
    )}
    <div className='text-sm text-slate-400'>{message}</div>
   </div>
  </div>
 );
}
