import { Image } from "ebombo-components";
import React, { forwardRef, useState, useMemo } from "reactn";
import styled from "styled-components";
import { config } from "../../firebase";

export const SharpButton = forwardRef(({ className, ...props }, ref) => {
  const [onHover, setOnHover] = useState(false);

  const prefixIcon = useMemo(() => {
    if (!props.prefixIcon) return null;

    if (props.disabled) return (<Image height="24px" width="24px" src={`${config.storageUrl}/resources/emoji-dead-face.svg`} />);

    let iconUrl;

    if (props.prefixIcon === "wink") iconUrl = `${config.storageUrl}/resources/emoji-face-wink.svg`;
    if (props.prefixIcon === "wink" && onHover) iconUrl = `${config.storageUrl}/resources/emoji-happy-face-wink.svg`;

    if (props.prefixIcon === "satisfied") iconUrl = `${config.storageUrl}/resources/emoji-satisfied-face.svg`;
    if (props.prefixIcon === "satisfied" && onHover) iconUrl = `${config.storageUrl}/resources/emoji-satisfied-happy-face.svg`;

    if (props.prefixIcon === "normal") iconUrl = `${config.storageUrl}/resources/emoji-face.svg`;
    if (props.prefixIcon === "normal" && onHover) iconUrl = `${config.storageUrl}/resources/emoji-happy-face.svg`;

    return (<Image className="inline-block" height="24px" width="24px" src={iconUrl} />);
  }, [props.prefixIcon, props.disabled, onHover]);

  return (<StyledSharpButton className={`${className} relative whitespace-nowrap inline-block
      px-6 py-4
      text-white text-lg border-secondary border-2
      ${!props.disabled && "hover:shadow-none hover:top-[3px] hover:left-[-5px] active:top-[2px] active:left-[-2px] active:shadow-sharp-sm"} focus:shadow-sharp-sm shadow-sharp`}
    ref={ref}
    onMouseEnter={() => setOnHover(true)}
    onMouseLeave={() => setOnHover(false)}
    {...props}>
    <span className="inline-block mr-1">{prefixIcon}</span>
    {props.children}
    </StyledSharpButton>
  );
});


const StyledSharpButton = styled.button`

  ${(props) => props.color === "primary"
      ? `
        background-color: ${props.theme.basic.primary};
    
        &:hover {
          background-color: #8360DF;
        }

        &:disabled,
        &[disabled]{
          background-color: #B6AAD5;
          border-color: #A59EB9;
          box-shadow: -5px 3px 0px 1px #A59EB9;
        }

      `
      : `
        background-color: #FF7059;

        &:hover {
          background-color: #EB6853;
        }

        &:disabled,
        &[disabled]{
          background-color: #D79C93;
          border-color: #A59EB9;
          box-shadow: -5px 3px 0px 1px #A59EB9;
        }
      `
  }

`;
