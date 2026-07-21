import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// Replace http:// or https:// with ws:// or wss://
const WS_BASE = API_BASE.replace(/^http/, 'ws');
const SOCKET_URL = `${WS_BASE}/ws`;

export const useSafetySocket = (zoneId = 'ZONE_3') => {
  const [safetyData, setSafetyData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: SOCKET_URL,
      debug: function (str) {
        console.log('[STOMP]:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket broker: ' + frame);
      setIsConnected(true);
      setError(null);

      stompClient.subscribe(`/topic/safety/${zoneId}`, (message) => {
        try {
          if (message.body) {
            const evaluation = JSON.parse(message.body);
            setSafetyData(evaluation);
          }
        } catch (err) {
          console.error("Error parsing safety data", err);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      setError(frame.headers['message'] || 'STOMP Protocol Error');
    };

    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [zoneId]);

  return { isConnected, safetyData, error };
};
