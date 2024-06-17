import { useState } from 'react';
import { ToastContextType, useToast, useToastDispatch } from '@/components/toast-provider';

export function useQueue<T>({ initialValues = [], limit }: { initialValues?: T[]; limit: number }) {
  const toastDispatch = useToastDispatch();
  const [{ state, queue }, setState] = useState({
    state: initialValues.slice(0, limit),
    queue: initialValues.slice(limit),
  });

  const notify = () => {
    queue.forEach((item) => {
      
    })
    toastDispatch({
      type: 'ADD_TOAST',
      payload: {
        type: 'info',
        message,
      } as MessagePrompt,
    });
  };

  const add = (...items: T[]) =>
    setState((current) => {
      const results = [...current.state, ...current.queue, ...items];

      return {
        state: results.slice(0, limit),
        queue: results.slice(limit),
      };
    });

  const update = (fn: (state: T[]) => T[]) =>
    setState((current) => {
      const results = fn([...current.state, ...current.queue]);

      return {
        state: results.slice(0, limit),
        queue: results.slice(limit),
      };
    });

  const cleanQueue = () => setState((current) => ({ state: current.state, queue: [] }));

  return {
    state,
    queue,
    add,
    update,
    cleanQueue,
  };
}