import React, { useMemo } from "reactn";
import styled from "styled-components";
import { Wheel } from "react-custom-roulette";
import { mediaQuery } from "../../constants";

const limitText = 18;

const FortuneWheel = (props) => {
  const spin = (e) => {
    e.preventDefault();

    // When the user has reached the limit of winners.
    if (props.disabled) return props.setIsVisibleModalMessage(true);

    const newPrizeNumber = Math.floor(Math.random() * props.data.length);
    props.setPrizeNumber(newPrizeNumber);
    props.setMustSpin(true);
  };

  const currentData = useMemo(() => {
    // Manage large text.
    return props.data.map((dat) => ({
      ...dat,
      option: dat.option.length > limitText ? `${dat.option.slice(0, limitText)}...` : dat.option,
    }));
  }, [props.data]);

  return (
    <CustomeWheel buttonColor={props.buttonColor} outerBorderColor={props.outerBorderColor}>
      {
        // Reference:
        // https://www.npmjs.com/package/react-custom-roulette
      }
      <Wheel {...props} data={currentData} />

      <div className="bg-selector bg-contain bg-no-repeat	z-50 absolute top-[16%] right-[13%] w-[28px] h-[30px]" />

      <div className="btn-container">
        <button className="spin" onClick={(e) => spin(e)}>
          GIRAR
        </button>
      </div>
    </CustomeWheel>
  );
};

const CustomeWheel = styled.div`
  width: max-content;
  position: relative;

  div:first-child {
    margin: 0 auto;
  }

  img {
    top: 5% !important;
    right: 2% !important;
    display: none;
  }

  .btn-container {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 50;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: ${(props) => props.buttonColor ?? props.theme.basic.gray};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: calc(70px + 0.5rem);
    height: calc(70px + 0.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
  }

  .spin {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: ${(props) => props.buttonColor ?? props.theme.basic.gray};
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.black};
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${mediaQuery.afterTablet} {
    .btn-container {
      width: calc(100px + 0.5rem);
      height: calc(100px + 0.5rem);
    }

    .spin {
      width: 100px;
      height: 100px;
    }
  }
`;

export default FortuneWheel;
