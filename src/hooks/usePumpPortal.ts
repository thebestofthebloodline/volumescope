"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Trade, NewToken } from "@/lib/types";

const WS_URL = "wss://pumpportal.fun/api/data";
const MAX_TRADES = 200;
const MAX_TOKENS = 100;

export function usePumpPortal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [newTokens, setNewTokens] = useState<NewToken[]>([]);
  const [connected, setConnected] = useState(false);
  const [tradesPerMin, setTradesPerMin] = useState(0);
  const [tokensPerHour, setTokensPerHour] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const tradeTimestamps = useRef<number[]>([]);
  const tokenTimestamps = useRef<number[]>([]);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calcRates = useCallback(() => {
    const now = Date.now();
    const oneMinAgo = now - 60_000;
    const oneHourAgo = now - 3_600_000;

    tradeTimestamps.current = tradeTimestamps.current.filter(
      (t) => t > oneMinAgo
    );
    tokenTimestamps.current = tokenTimestamps.current.filter(
      (t) => t > oneHourAgo
    );

    setTradesPerMin(tradeTimestamps.current.length);
    setTokensPerHour(tokenTimestamps.current.length);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        ws.send(JSON.stringify({ method: "subscribeNewToken" }));
        ws.send(
          JSON.stringify({
            method: "subscribeTokenTrade",
            keys: [],
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const now = Date.now();

          if (data.txType === "buy" || data.txType === "sell") {
            const trade: Trade = {
              signature: data.signature || "",
              mint: data.mint || "",
              sol_amount: data.solAmount || data.sol_amount || 0,
              token_amount: data.tokenAmount || data.token_amount || 0,
              is_buy: data.txType === "buy",
              user: data.traderPublicKey || data.user || "",
              timestamp: now,
              name: data.name,
              symbol: data.symbol,
            };

            tradeTimestamps.current.push(now);
            setTrades((prev) => [trade, ...prev].slice(0, MAX_TRADES));
          }

          if (data.txType === "create") {
            const token: NewToken = {
              signature: data.signature || "",
              mint: data.mint || "",
              name: data.name || "Unknown",
              symbol: data.symbol || "???",
              uri: data.uri,
              timestamp: now,
            };

            tokenTimestamps.current.push(now);
            setNewTokens((prev) => [token, ...prev].slice(0, MAX_TOKENS));
          }
        } catch {
          // skip malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      reconnectTimeout.current = setTimeout(connect, 5000);
    }
  }, []);

  useEffect(() => {
    connect();
    const rateInterval = setInterval(calcRates, 2000);

    return () => {
      clearInterval(rateInterval);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [connect, calcRates]);

  return { trades, newTokens, connected, tradesPerMin, tokensPerHour };
}
