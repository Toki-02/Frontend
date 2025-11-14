import React, { useRef } from "react";
import Webcam from "react-webcam";

export default function CameraFeed({onCapture}) {
  const ref = useRef(null);
  const capture = () => {
    if(!ref.current) return;
    const img = ref.current.getScreenshot();
    if(onCapture) onCapture(img);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-80 h-56 bg-black/40 rounded-lg overflow-hidden">
        <Webcam audio={false} ref={ref} screenshotFormat="image/jpeg" className="w-full h-full object-cover"/>
      </div>
      <div className="flex gap-2">
        <button onClick={capture} className="btn bg-blue-600 hover:bg-blue-700 text-white">Capture</button>
      </div>
    </div>
  );
}
