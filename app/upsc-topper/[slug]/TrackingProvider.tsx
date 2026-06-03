"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";

export default function TrackingProvider({ name }: { name: string }) {
  useEffect(() => {
    trackViewItem(`Topper - ${name}`, 0);
  }, [name]);
  return null;
}
