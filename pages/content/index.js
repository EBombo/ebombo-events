import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { Content } from "../../src/pages/content";

const ContentContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Content {...props} />
    </Navbar>
  </>
);

export default ContentContainer;

