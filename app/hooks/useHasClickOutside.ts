import { useEffect, useLayoutEffect, useRef } from "react";

export function useHasClickOutside(callback: (e: any) => void) {
  const ref = useRef(null);
  const refCb = useRef(callback);

  useLayoutEffect(() => {
    refCb.current = callback;
  });

  useEffect(() => {
    const clickHandler = (e) => {
      const element = ref.current;
      if (element && !element.contains(e.target)) {
        refCb.current(e);
      }
    };

    document.addEventListener("mousedown", clickHandler);
    document.addEventListener("touchstart", clickHandler);

    return () => {
      document.removeEventListener("mousedown", clickHandler);
      document.removeEventListener("touchstart", clickHandler);
    };
  }, []);

  return ref;
}