export const isMobile = () =>
  typeof window.screen.width !== "undefined" ||
  navigator.userAgent.indexOf("IEMobile") !== -1;
