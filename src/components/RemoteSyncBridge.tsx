"use client";

import { useEffect } from "react";

import { ROOM_RESET_EVENT } from "@/lib/demo-state";
import { clearRoom, resumeStoredRoom } from "@/lib/remote-sync";

/**
 * THE PHONE PATH, on every page — ADDED 2026-09-30 (src/lib/remote-sync.ts,
 * docs/PHONE_PATH.md). Renders nothing.
 *
 * 1. After a FULL reload (the phone's browser reloading W-05, say) it
 *    re-attaches this window to the room it was already in, so the phone
 *    keeps pushing its progress to the laptop.
 * 2. When the demo is reset (Esc, /reset — `resetAll` fires ROOM_RESET_EVENT
 *    with the room it dropped) it deletes that room on the server.
 *
 * Without a stored room — always the case on a static build, and on the
 * laptop until phone mode is turned on at /demo/phone/ — neither ever
 * happens, and it makes no request at all.
 */
export function RemoteSyncBridge() {
  useEffect(() => {
    const onReset = (e: Event) => {
      const room = (e as CustomEvent<unknown>).detail;
      void clearRoom(typeof room === "string" ? room : null);
    };
    window.addEventListener(ROOM_RESET_EVENT, onReset);
    void resumeStoredRoom();
    return () => window.removeEventListener(ROOM_RESET_EVENT, onReset);
  }, []);
  return null;
}
