import React, { useEffect, useState } from "reactn";
import { Tooltip } from "antd";
import { darkTheme } from "../../../../theme";

export const WarningIconTooltip = ({ outline = true, ...props }) => {
  const [isVisible, setIsVisible] = useState(props.visible);

  useEffect(() => {
    if (!props.visible) return;
    if (!props.duration) return;

    setIsVisible(props.visible);

    setTimeout(() => {
      setIsVisible(false);
    }, props.duration);
  }, [props.visible]);

  return (
    <Tooltip
      placement={props.placement ?? "right"}
      color={darkTheme.basic.secondary}
      visible={isVisible}
      title={props.message}
    >
      <div className="inline-block h-6 w-6">
        {isVisible && (
          <div
            className={`inline-block h-6 w-6 leading-tight rounded-full bg-secondary p-1 text-white text-center font-bold animate-bounce-in ${
              outline && "outline outline-offset-1 outline-white-500"
            }`}
          >
            !
          </div>
        )}
      </div>
    </Tooltip>
  );
};
