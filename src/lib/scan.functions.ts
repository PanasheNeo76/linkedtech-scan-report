import { createServerFn } from "@tanstack/react-start";
import type { ScanResult } from "./scan-types";

export const scanUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const raw =
      typeof data === "object" && data !== null
        ? String((data as { url?: unknown }).url ?? "")
        : "";
    const url = raw.trim();
    if (!url) throw new Error("Please enter a website or LinkedIn address.");
    const candidate = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    let parsed: URL;
    try {
      parsed = new URL(candidate);
    } catch {
      throw new Error("That does not look like a valid web address.");
    }
    if (!parsed.hostname.includes("."))
      throw new Error("That does not look like a valid web address.");
    return { url: parsed.toString() };
  })
  .handler(async ({ data }): Promise<ScanResult> => {
    const { runScan } = await import("./scan.server");
    return runScan(data.url);
  });
