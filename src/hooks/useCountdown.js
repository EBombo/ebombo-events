import { useEffect, useState } from "reactn";

const useCountdown = () => {
  const [countdownDate, setCountdownDate] = useState(null);

  const [countDown, setCountDown] = useState(new Date().getTime());

  useEffect(() => {
    if (!countdownDate) return;

    setCountDown(countdownDate - new Date().getTime());

    const interval = setInterval(() => {
      setCountDown(countdownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownDate]);

  // Calculate time left.
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return {
    countdownDate,
    setCountdownDate,
    timer: [days, hours, minutes, seconds]
  };
};

export default useCountdown;

