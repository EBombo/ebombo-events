import {Dropdown, Menu} from "antd";
import React, {useGlobal} from "reactn";
import {languages} from "../utils";
import styled from "styled-components";
import {colorBlack, colorWhite, Desktop, mediaQuery, sizes, Tablet} from "../constants";
import {setLocale} from "yup";
import {yup} from "../config";
import {useLanguageCode} from "../hoc";

export const LanguagesMenu = () => {
    const [languageCode, setLanguageCode] = useGlobal("languageCode");
    const [, setLanguageCodeLS] = useLanguageCode();

    const setCurrentLanguage = async code => {
        await setLanguageCode(code);
        setLocale(yup[code]);
        return setLanguageCodeLS(code)
    };

    const currentLanguage = () => languages.find(language => language.code === languageCode);

    const languageMenu = (
        <MenuAnt>
            {
                languages
                    .map(language =>
                        <Language key={language.code}
                                  onClick={() => setCurrentLanguage(language.code)}>
                            <Flag src={language.flag}/>
                            <Name>{language.name}</Name>
                        </Language>
                    )
            }
        </MenuAnt>
    );

    const dropDownContainer = () =>
        <Dropdown overlay={languageMenu}
                  trigger={["click"]}>
            <Trigger>
                <Flag src={currentLanguage().flag}/>
            </Trigger>
        </Dropdown>

    return <>
        <Desktop>
            {dropDownContainer()}
        </Desktop>
        <Tablet>
            {dropDownContainer()}
        </Tablet>
    </>
};

const Name = styled.p`
  color: ${props => props.light ? "white" : "initial"};
  font-size: ${sizes.font.small};
  margin: 0 0 0 10px;

  ${mediaQuery.afterMobile}) {
  display: block !important;
}
`;

const Trigger = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;


const Language = styled(Menu.Item)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 120px;
`;

const Flag = styled.img`
  height: ${sizes.font.normal};
`;

const MenuAnt = styled(Menu)`
  background: ${colorBlack.lighten_4};

  p {
    color: ${colorWhite.white};
  }
`;
