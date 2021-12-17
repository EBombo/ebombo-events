import React from "react";
import { addDecorator } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "../src/theme";

addDecorator((story) => <ThemeProvider theme={darkTheme}>{story()}</ThemeProvider>);
