import React, { useEffect, useState } from "react";

export const LoadingNumbers = (props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    count !== props.maxNumberProgresive && count <= props.maxNumberProgresive
      ? setCount(count + props.accountant)
      : setCount(props.maxNumberProgresive);
  }, [count, props.maxNumberProgresive]);

  return count;
};
