import React from "react";
import { ButtonAnt } from "../components/form";
import { darkTheme } from "../theme";

export default {
  title: "Components/Form/Buttons",
  component: ButtonAnt,
};

const Template = (args) => <ButtonAnt {...args} />;

export const OutlinedPrimary = Template.bind({});
OutlinedPrimary.args = {
  variant: "outlined",
  color: "primary",
};

export const OutlinedSecondary = Template.bind({});
OutlinedSecondary.args = {
  variant: "outlined",
  color: "secondary",
  theme: darkTheme,
};

export const OutlinedWarning = Template.bind({});
OutlinedWarning.args = {
  variant: "outlined",
  color: "warning",
  children: "WARNING",
};

export const OutlinedDanger = Template.bind({});
OutlinedDanger.args = {
  variant: "outlined",
  color: "danger",
  children: "DANGER",
};

export const ContainedPrimary = Template.bind({});
ContainedPrimary.args = {
  variant: "contained",
  color: "primary",
  children: "PRIMARY",
};

export const ContainedSecondary = Template.bind({});
ContainedSecondary.args = {
  variant: "contained",
  color: "secondary",
  children: "SECONDARY",
};

export const ContainedWarning = Template.bind({});
ContainedWarning.args = {
  variant: "contained",
  color: "warning",
  children: "WARNING",
};

export const ContainedDanger = Template.bind({});
ContainedDanger.args = {
  variant: "contained",
  color: "danger",
  children: "DANGER",
};
