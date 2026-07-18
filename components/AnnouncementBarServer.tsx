/**
 * AnnouncementBarServer — server component version.
 *
 * Renders the announcement bar directly from pre-fetched server data.
 * Used by HomeClientShell to avoid a CSR flash on the home page.
 *
 * This file is intentionally NOT used standalone — the HomeClientShell
 * receives the message as a prop and renders the bar inline to avoid
 * an extra async component boundary.
 *
 * Kept here as a reusable server component for other server pages.
 */

import { serverGetActiveAnnouncements } from '@/lib/api/server';

export default async function AnnouncementBarServer() {
  const announcements = await serverGetActiveAnnouncements();
  const message = announcements
    .map((a) => a.message.trim())
    .filter(Boolean)
    .join(' • ');

  if (!message) return null;

  return (
    <div className="bg-linear-to-r from-[#e91e8c] via-[#c2185b] to-[#e91e8c] text-white text-center py-2.5 px-5 font-nunito text-[13px] font-bold tracking-wider">
      {message}
    </div>
  );
}
