"use client";

import { useState, useCallback, useRef } from "react";
import { API_ENDPOINTS } from "@/utils/apiConfig";

export type TestPhase = "idle" | "ping" | "download" | "upload" | "complete";

export interface SpeedTestMetrics {
  latency: number | null; // ms
  jitter: number | null; // ms
  downloadSpeed: number | null; // Mbps
  uploadSpeed: number | null; // Mbps
  progress: number; // 0-100
}

export function useSpeedTest() {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [metrics, setMetrics] = useState<SpeedTestMetrics>({
    latency: null,
    jitter: null,
    downloadSpeed: null,
    uploadSpeed: null,
    progress: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = () => {
    setPhase("idle");
    setMetrics({
      latency: null,
      jitter: null,
      downloadSpeed: null,
      uploadSpeed: null,
      progress: 0,
    });
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const runTest = useCallback(async () => {
    reset();
    setPhase("ping");
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // --- PING PHASE ---
      const pings: number[] = [];
      const MAX_PINGS = 5;

      for (let i = 0; i < MAX_PINGS; i++) {
        if (signal.aborted) return;
        const start = performance.now();
        try {
          await fetch(API_ENDPOINTS.PING, {
            cache: "no-store",
            signal,
          });
          const end = performance.now();
          pings.push(end - start);
        } catch (e) {
          console.warn("Ping failed", e);
          pings.push(100);
        }
        setMetrics((m) => ({ ...m, progress: 5 + (i / MAX_PINGS) * 15 }));
      }

      const validPings = pings.length > 0 ? pings : [0];
      const avgLatency = validPings.reduce((a, b) => a + b, 0) / validPings.length;
      const variance =
        validPings.reduce((a, b) => a + Math.pow(b - avgLatency, 2), 0) /
        validPings.length;
      const jitter = Math.sqrt(variance);

      setMetrics((m) => ({
        ...m,
        latency: avgLatency,
        jitter: jitter,
        progress: 20,
      }));

      if (signal.aborted) return;

      // --- DOWNLOAD PHASE ---
      setPhase("download");
      const downloadStart = performance.now();
      let totalLoaded = 0;

      // We will perform multiple fetches in parallel to saturate the link
      const streams = 4;
      const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB requests

      // Shared reference for atomic updates
      const progressRef = { bytes: 0 };

      const promises = Array.from({ length: streams }).map(async () => {
        try {
          const response = await fetch(
            `${API_ENDPOINTS.DOWNLOAD}?size=${CHUNK_SIZE}`,
            { signal, cache: "no-store" }
          );
          if (!response.body) return;
          const reader = response.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              progressRef.bytes += value.length;

              const now = performance.now();
              const duration = (now - downloadStart) / 1000; // seconds

              // Update metrics every ~50ms max to allow UI updates
              if (duration > 0.1) {
                const speedBps = (progressRef.bytes * 8) / duration;
                const speedMbps = speedBps / 1000000;

                setMetrics(prev => ({
                  ...prev,
                  downloadSpeed: Math.max(0.1, speedMbps), // Ensure it's not 0 instantly
                  progress: 20 + Math.min(40, (progressRef.bytes / (streams * CHUNK_SIZE)) * 40)
                }));
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      });

      await Promise.all(promises);

      const downloadEnd = performance.now();
      const downloadDuration = (downloadEnd - downloadStart) / 1000;
      const finalDownloadMbps = downloadDuration > 0
        ? (progressRef.bytes * 8) / (downloadDuration * 1000000)
        : 0;

      setMetrics((m) => ({
        ...m,
        downloadSpeed: finalDownloadMbps,
        progress: 60,
      }));

      if (signal.aborted) return;

      setPhase("upload");
      const uploadStart = performance.now();
      const uploadSize = 10 * 1024 * 1024; // 10MB to ensure we get some readings
      const blob = new Blob([new Uint8Array(uploadSize)]);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_ENDPOINTS.UPLOAD, true);

        // Listen for upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const now = performance.now();
            const duration = (now - uploadStart) / 1000; // seconds

            if (duration > 0.1) {
              const speedBps = (event.loaded * 8) / duration;
              const speedMbps = speedBps / 1000000;

              setMetrics((prev) => ({
                ...prev,
                uploadSpeed: Math.max(0.1, speedMbps),
                progress: 60 + ((event.loaded / event.total) * 40),
              }));
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const end = performance.now();
            const duration = (end - uploadStart) / 1000;
            const speed = (uploadSize * 8) / (duration * 1000000);
            setMetrics((prev) => ({ ...prev, uploadSpeed: speed, progress: 100 }));
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload network error"));

        // Handle abort
        if (signal) {
          signal.addEventListener('abort', () => {
            xhr.abort();
            reject(new Error('Aborted'));
          });
        }

        xhr.send(blob);
      });

      setPhase("complete");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Test Error", error);
        setPhase("idle");
      }
    }
  }, []);

  return { phase, metrics, runTest, reset };
}
