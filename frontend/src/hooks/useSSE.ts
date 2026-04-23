import { useEffect, useRef, useState } from 'react';

export type SSEEventName =
  | 'request-created'
  | 'request-assigned'
  | 'status-updated'
  | 'priority-updated'
  | 'note-added'
  | 'request-updated';

type SSEHandlers = Partial<Record<SSEEventName, () => void>>;

export function useSSE(handlers: SSEHandlers): boolean {
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const es = new EventSource('/api/events/subscribe');

    es.onopen = () => setIsConnected(true);
    es.onerror = () => setIsConnected(false);

    const names: SSEEventName[] = [
      'request-created', 'request-assigned', 'status-updated',
      'priority-updated', 'note-added', 'request-updated',
    ];

    names.forEach(name => {
      es.addEventListener(name, () => {
        handlersRef.current[name]?.();
      });
    });

    return () => {
      es.close();
      setIsConnected(false);
    };
  }, []);

  return isConnected;
}
