import React, { useGlobal } from "reactn";
import { useHistory } from "react-router";
import styled from "styled-components";
import {
  ButtonBombo,
  Checkbox,
  Input,
  Select,
  TextArea,
} from "../../components";

export default () => {
  const history = useHistory();
  const [authUser] = useGlobal("user");

  if (!authUser || !authUser.isAdmin) history.push("/");
  return (
    <DesignContainer>
      <h1 style={{ color: "#fff" }}>INPUTS</h1>
      <InputGroup>
        <Input variant="primary" label="Input primary" placeholder="test" />
        <Input variant="secondary" label="Input secondary" placeholder="test" />
      </InputGroup>
      <InputGroup>
        <Select
          label="Select primary"
          variant="primary"
          placeholder="Test"
          showSearch
          optionsdom={["uno", "dos", "tres", "cuatro"].map((item, idx) => ({
            key: idx,
            code: item,
            name: item,
          }))}
          style={{ width: "200px" }}
        />
        <Select
          label="Select secondary"
          variant="secondary"
          placeholder="Test2"
          showSearch
          optionsdom={["uno", "dos", "tres", "cuatro"].map((item, idx) => ({
            key: idx,
            code: item,
            name: item,
          }))}
          style={{ width: "200px" }}
        />
      </InputGroup>
      <InputGroup>
        <Checkbox
          label="Checkbox"
          options={[
            {
              label: <label style={{ cursor: "pointer" }}>Test</label>,
              value: "WR",
            },
          ]}
          checked={true}
        />
        <Checkbox
          label="Checkbox required"
          options={[
            {
              label: <label style={{ cursor: "pointer" }}>Test</label>,
              value: "WR",
            },
          ]}
          required
        />
      </InputGroup>
      <InputGroup>
        <TextArea
          variant="primary"
          label="TextArea primary"
          placeholder="Test"
        />
        <TextArea
          variant="secondary"
          label="TextArea secondary"
          placeholder="Test"
        />
      </InputGroup>
      <h1 style={{ color: "#fff" }}>BUTTONS</h1>
      <InputGroup>
        <ButtonBombo type="primary">Primary</ButtonBombo>
        <ButtonBombo type="secondary">Secondary</ButtonBombo>
      </InputGroup>
    </DesignContainer>
  );
};

const DesignContainer = styled.div`
  margin: 30px auto;
  max-width: 50%;
`;

const InputGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
