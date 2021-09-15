import { useEffect, useRef } from "reactn";

export const useClickOutside = (handler) => {
  let domNodeRef = useRef();

  useEffect(() => {
    const innerHandler = (event) => {
      if (!domNodeRef.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", innerHandler);

    return () => {
      document.removeEventListener("mousedown", innerHandler);
    };
  }, []);
};
