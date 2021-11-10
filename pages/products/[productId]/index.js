import React from "reactn";
import { ProductDetail } from "../../../src/pages/products/_productId";
import { SEOMeta } from "../../../src/components/common/seo";
import { Navbar } from "../../../src/components/Navbar";

const ProductDetailContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <ProductDetail {...props} />
    </Navbar>
  </>
);

export default ProductDetailContainer;
