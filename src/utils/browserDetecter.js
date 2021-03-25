export const browserDetecter = () => {
  const aKeys = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"],
    sUsrAg = navigator.userAgent;
  let nIdx = aKeys.length - 1;

  for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);

  return aKeys[nIdx];
};
