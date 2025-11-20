import React from "react";

/* Simple QR display placeholder */
export default function QRGenerator({ value }) {
  if (!value) return null;
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='#fff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#1E40AF' font-size='12'>${value}</text></svg>`);
  return <img src={`data:image/svg+xml;utf8,${svg}`} alt="qr" className="w-40 h-40 rounded-md border" />;
}
