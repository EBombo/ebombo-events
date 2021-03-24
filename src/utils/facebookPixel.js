import ReactPixel from "react-facebook-pixel";
import {config} from "../firebase";

export const initializeFacebookPixel = () => {
    const options = {
        autoConfig: true,
        debug: true,
    };
    ReactPixel.init(config.facebookPixel, {}, options);
    ReactPixel.pageView();
};