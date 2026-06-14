"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function SessionActivity() {
  const { data: session, update } = useSession();
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate.current >= 300000) {
        lastUpdate.current = now;
        update();
      }
    };

    window.addEventListener("click", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [session, update]);

  return null;
}