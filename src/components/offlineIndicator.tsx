"use client";

import { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    update();

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div
      className={`w-full text-center p-2 text-sm font-semibold ${
        online ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {online ? "Online" : "Offline"}
    </div>
  );
}
