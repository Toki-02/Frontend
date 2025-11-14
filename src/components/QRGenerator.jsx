import React from "react";
import QRCode from "react-qr-code";

export default function QRGenerator({ text }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-white text-xl mb-4 font-semibold">Generated QR Code</h2>
      <QRCode
        value={text || "https://example.com"}
        size={200}
        fgColor="#ffffff"
        bgColor="transparent"
        className="p-4 bg-black/30 rounded-xl"
      />
    </div>
  );
}
