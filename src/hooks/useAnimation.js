import { useEffect, useRef, useState } from "reactn";
import { fadeIn } from "react-animations";
import styled, { keyframes } from "styled-components";

const Child = (props) => {
  const animation = keyframes`${props.effect}`;

  const [isIntersecting, setIntersecting] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), { threshold: 0.1 });

    observer.observe(componentRef.current);

    return () => observer.disconnect();
  }, []);

  const ComponentCss = styled.div`
    display: ${(props) => (props.isIntersecting ? "initial" : "none")};
    //animation: ${(props) => `${props.seconds}s ${animation}`};
  `;

  return (
    <ComponentCss ref={componentRef} seconds={props.seconds} isIntersecting={isIntersecting}>
      {props.children}
    </ComponentCss>
  );
};

export const useAnimation = (seconds = 1, effect = fadeIn) => {
  const Animation = (props) =>
    props.children?.length ? (
      props.children.map((child) => (
        <Child seconds={seconds} effect={effect}>
          {child}
        </Child>
      ))
    ) : (
      <Child seconds={seconds} effect={effect}>
        {props.children}
      </Child>
    );

  return { Animation };
};
