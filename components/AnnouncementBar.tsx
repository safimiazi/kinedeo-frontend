"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Announcement } from "@/lib/api/types";

export default function AnnouncementBar() {
  const [message, setMessage] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAnnouncement() {
      try {
        const announcements = await apiRequest<Announcement[]>("/announcements/active", { auth: false });

        if (!mounted) return;

        const activeMessage = announcements
          .map((a) => a.message.trim())
          .filter(Boolean)
          .join(" • ");

        setMessage(activeMessage || null);
      } catch {
        setMessage(null);
      } finally {
        if (mounted) setLoaded(true);
      }
    }

    loadAnnouncement();
    return () => { mounted = false; };
  }, []);

  // Don't render anything until loaded, and hide if no active announcements
  if (!loaded || !message) return null;

  return (
    <div className="bg-linear-to-r from-[#e91e8c] via-[#c2185b] to-[#e91e8c] text-white text-center py-2.5 px-5 font-nunito text-[13px] font-bold tracking-wider">
      {message}
    </div>
  );
}
