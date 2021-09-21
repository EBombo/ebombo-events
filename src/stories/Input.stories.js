import React from "react";
import { Input } from "../components/form";
import { darkTheme } from "../theme";

export default {
  title: "Components/Form/Inputs",
  component: Input,
};

const Template = (args) => <Input {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  defaultValue: "PRIMARY",
  theme: darkTheme,
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  defaultValue: "Secondary",
  theme: darkTheme,
};

export const Default = Template.bind({});
Default.args = {
  variant: "default",
  defaultValue: "Default",
  theme: darkTheme,
};
