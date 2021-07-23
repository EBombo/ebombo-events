import React from "react";
import { Anchor } from "../components/form";
import {darkTheme} from "../theme";

export default {
    title: "Components/Form/Anchor",
    component: Anchor,
};

const Template = (args) => <Anchor {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    variant: "primary",
    children: "Primary",
    theme: darkTheme
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: "secondary",
    children: "Secondary",
    theme: darkTheme
};

export const Default = Template.bind({});
Default.args = {
    variant: "default",
    children: "Default",
    theme: darkTheme
};