import ReactPixel from "react-facebook-pixel";

export const initializeFacebookPixel = () => {
  const options = {
    autoConfig: true,
    debug: true,
  };
  ReactPixel.init("2611152949211928", {}, options);
  ReactPixel.pageView();
};
