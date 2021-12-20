import React from "reactn";
import { Home } from "../src/pages/home";
import { SEOMeta } from "../src/components/common/seo";
import { Navbar } from "../src/components/Navbar";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Home {...props} />
    </Navbar>
  </>
);

export default Init;

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "public, s-maxage=2592000, stale-while-revalidate=30");

  return {
    props: {},
  };
}
