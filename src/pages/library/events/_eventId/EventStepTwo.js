import React, { useGlobal, useRef, useState } from "reactn";
import { Anchor, ButtonAnt, Input, Select, TextArea } from "../../../../components/form";
import { Table } from "antd";
import isEmpty from "lodash/isEmpty";
import { firestore } from "../../../../firebase";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { useTranslation } from "../../../../hooks";
import { tableEventsColumns } from "../../../../components/common/DataList";

export const EventStepTwo = (props) => {
  const [authUser] = useGlobal("user");

  const { t } = useTranslation("pages.library.event");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [addingVisitors, setAddingVisitors] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const inputRef = useRef(null);

  const schema = object().shape({
    visitors: string().required(),
  });

  const { register, errors, handleSubmit, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const deleteSelectedUsers = () => {};

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const addVisitors = async (data) => {
    setAddingVisitors(true);
    const visitorsArray = data.visitors.split("\n");
    const _filterVisitors = visitorsArray.filter((visitor) => visitor !== "");

    const _visitors = _filterVisitors.map((visitor) => ({
      email: visitor,
      role: "visitor",
      createAt: new Date(),
      id: firestore.collection("companies").doc(authUser?.company.id).collection("members").doc().id,
      searchName: [visitor.toUpperCase()],
      status: "Active",
      deleted: false,
    }));

    await props.setMembers(props.members.concat(_visitors));

    await reset();

    setAddingVisitors(false);
  };

  const readExcel = async (e) => {
    setFileLoading(true);
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      const newEmails = data.split("\n");

      newEmails.shift();

      newEmails.filter((email) => email !== "");

      const _visitors = newEmails.map((email) => ({
        email,
        role: "visitor",
        createAt: new Date(),
        id: firestore.collection("companies").doc(authUser?.company.id).collection("members").doc().id,
        searchName: [email.toUpperCase()],
        status: "Active",
        deleted: false,
      }));

      await props.setMembers(props.members.concat(_visitors));
    };

    reader.readAsBinaryString(file);

    setFileLoading(false);
  };

  const filterOptions = [
    {
      key: "email",
      name: t("email"),
    },
    {
      key: "role",
      name: t("role"),
    },
    {
      key: "status",
      name: t("status"),
    },
  ];

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        {t("step-two.title")}
      </div>

      <div className="flex mt-8 gap-8 w-full flex-col md:flex-row">
        <div>
          <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] text-secondary">
            {t("step-two.subtitle-one")}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[5px]">
              <div>{t("step-two.filter")}</div>
              <Select
                showSearch
                defaultValue={"email"}
                virtual={false}
                optionFilterProp="children"
                optionsdom={filterOptions.map((filter) => ({
                  key: filter.key,
                  code: filter.key,
                  name: filter.name,
                }))}
              />
            </div>
            <div>
              <Input type="search" placeholder={t("step-two.search-placeholder")} />
            </div>
          </div>
          <div className="my-4 w-full overflow-auto">
            {!isEmpty(selectedUsers) && (
              <div
                className="my-4 cursor-pointer text-['Lato'] text-[12px] text-blackDarken leading-[14px] underline md:text-[16px] md:leading-[19px]"
                onClick={() => deleteSelectedUsers()}
              >
                {t("step-two.delete")}
              </div>
            )}
            <div className="min-w-[500px]">
              <Table
                selectedRowKeys={selectedRowKeys}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                columns={tableEventsColumns(t)}
                dataSource={props.members}
              />
            </div>
          </div>
        </div>
        <form className="w-full md:max-w-[400px]" onSubmit={handleSubmit(addVisitors)}>
          <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] text-secondary">
            {t("step-two.subtitle-two")}
          </div>
          <div className="mt-4">
            <TextArea
              name="visitors"
              ref={register}
              error={errors.visitors}
              color="black"
              background={"#FAFAFA"}
              border={"1px solid #C4C4C4"}
              placeholder={t("step-two.textarea-placeholder")}
              rows="10"
            />
          </div>
          <div className="flex items-center gap-[10px] my-4">
            <ButtonAnt color="default" htmlType="submit" loading={addingVisitors}>
              {t("step-two.add")}
            </ButtonAnt>
            <ButtonAnt color="default" onClick={() => inputRef.current.click()} loading={fileLoading}>
              {t("step-two.import")}
            </ButtonAnt>
            <input type="file" ref={inputRef} onChange={readExcel} hidden />
          </div>
        </form>
      </div>

      <div className="flex w-full items-center justify-between">
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(1)}>
          {t("step-two.go-back")}
        </Anchor>
        <ButtonAnt disabled={addingVisitors} onClick={() => props.setCurrentStep(3)}>
          {t("step-two.next")}
        </ButtonAnt>
      </div>
    </div>
  );
};
