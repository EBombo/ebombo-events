import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { AboutUs } from "../../src/pages/about-us";

const AboutUsContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <AboutUs {...props} />
    </Navbar>
  </>
);

export default AboutUsContainer;
