import React from "reactn";
import { Navbar } from "../../src/components/Navbar";
import { SEOMeta } from "../../src/components/common/seo";
import { ContactForm } from "../../src/pages/contact";

const FoundersContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <ContactForm {...props} />
    </Navbar>
  </>
);

export default FoundersContainer;
