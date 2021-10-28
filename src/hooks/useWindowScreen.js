import { useState, useEffect } from "reactn";

export const useWindowSize = () => {

  const isWindowClient = typeof window === "object";

  const [windowSize, setWindowSize] = useState(
    isWindowClient ? window.innerWidth : undefined
  );

  useEffect(() => {
    function setSize() {
      console.log("setSize", window.innerWidth);
      setWindowSize(window.innerWidth);
    }

    if (isWindowClient) {
      window.addEventListener("resize", setSize);

      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
}

/*
const handleWindowResize = useCallback((e) => {
    clearTimeout(resizeTimer.current);
    resizeTimer.current = setTimeout(() => {
      setWidth(e.target.innerWidth);
      setHeight(e.target.innerHeight);

    }, 200);

  }, [setWidth, setHeight, resizeTimer]);

useEffect(() => {
  window.addEventListener('resize',handleWindowResize);
  return () => {
    window.removeEventListener('resize', handleWindowResize);
  };
}, [handleWindowResize]);


*/
