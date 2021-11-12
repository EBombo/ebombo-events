import React from "reactn";
import { Plans } from "./Plans";
import { Navbar } from "../../components/Navbar";

export const Subscriptions = (props) => (
  <>
    <Navbar {...props}>
      <Plans {...props} tab={"games"} />
    </Navbar>
  </>
);
