const CONFIG = process.env.NEXT_PUBLIC_CONFIG ?? "";

const config = JSON.parse(CONFIG);

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#956DFC",
        primaryDark: "#5D449E",
        primaryLight: "#C4ADFF",
        primaryLighten: "#A18ED7",
        secondary: "#382079",
        secondaryDark: "#170D33",
        secondaryLight: "#251552",
        secondaryHover: "#62518f",
        success: "#32C78D",
        successDark: "#23996B",
        white: "#ffffff",
        whiteDarken: "#D2D2D2",
        whiteDark: "#F2F2F2",
        whiteLight: "#FAFAFA",
        whiteLighten: "#F7F8FA",
        warning: "#FFC715",
        danger: "#DE0F0F",
        default: "#494949",
        black: "#000000",
        blackLighten: "#404040",
        blackDarken: "#242424",
        grayDarken: "#585858",
        grayDark: "#858585",
        grayLight: "#666666",
        grayLighten: "#C4C4C4",
        gray: "#E4E4E4",
        red: "#D62323",
        green: "#03A45E",
        orange: "#F9A31D",
        blue: "#20409B",
      },
      backgroundImage: () => ({
        pattern: `url('${config.storageUrl}/resources/pattern.svg')`,
        selector: `url('${config.storageUrl}/resources/selector.png')`,
      }),
    },
  },
  plugins: [],
};
