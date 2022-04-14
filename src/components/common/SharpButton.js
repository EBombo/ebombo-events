import React, { forwardRef } from "reactn";

// Variant="outlined".
// Variant="contained".

export const SharpButton = forwardRef((props, ref) => (
  <button className={`whitespace-nowrap inline-block px-6 py-4 text-white text-lg ${props.color ? ("bg-" + props.color) :  "bg-orangeLight" } border-secondary border-2 hover:shadow-sharp shadow-sharp-md`} ref={ref} {...props}>
    {props.children}
  </button>
));


