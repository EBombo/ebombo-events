import React from "react";

import { ButtonBombo } from "../components";

export default {
  title: "Components/UI Elements/Button",
  component: ButtonBombo,
};

const Template = (args) => <ButtonBombo {...args} />;

export const OutlinedPrimary = Template.bind({});
OutlinedPrimary.args = {
  variant: "outlined",
  color: "primary",
  children: "PRIMARY",
};

export const OutlinedSecondary = Template.bind({});
OutlinedSecondary.args = {
  variant: "outlined",
  color: "secondary",
  children: "SECONDARY",
};

export const OutlinedAction = Template.bind({});
OutlinedAction.args = {
  variant: "outlined",
  color: "action",
  children: "ACTION",
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

export const ContainedAction = Template.bind({});
ContainedAction.args = {
  variant: "contained",
  color: "action",
  children: "ACTION",
};

export const ContainedDanger = Template.bind({});
ContainedDanger.args = {
  variant: "contained",
  color: "danger",
  children: "DANGER",
};
