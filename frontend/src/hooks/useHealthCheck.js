import { useState, useEffect, useCallback } from 'react';
import { checkBackendHealth } from '../services/api';

export function useHealthCheck(pollIntervalMs = 15000) {
  const [health, setHealth] = useState({
    status: 'checking',
    service: 'trustledger-api',
    lastChecked: null,
    latencyMs: null
  });

  const runCheck = useCallback(async () => {
    const start = performance.now();
    const result = await checkBackendHealth();
    const latency = Math.round(performance.now() - start);

    setHealth({
      ...result,
      latencyMs: latency,
      lastChecked: new Date()
    });
  }, []);

  useEffect(() => {
    runCheck();
    if (pollIntervalMs > 0) {
      const interval = setInterval(runCheck, pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [runCheck, pollIntervalMs]);

  return { ...health, refetch: runCheck };
}
