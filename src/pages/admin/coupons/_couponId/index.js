import React, {useEffect, useState} from "react";
import {firestore} from "../../../../firebase";
import get from "lodash/get";
import assign from "lodash/assign";
import findIndex from "lodash/findIndex";
import styled from "styled-components";
import {Checkbox, message, Modal, Select as AntSelect} from "antd";
import {discountType} from "../../../../components/common/DataList";
import {ButtonBombo, DatePicker, Input, Select} from "../../../../components";
import moment from "moment";
import {spinLoader} from "../../../../utils";
import {useHistory, useParams} from "react-router";
import {Controller, useForm} from "react-hook-form";
import {date, number, object, string} from "yup";

export const AdminCouponEdit = () => {
  const schema = object().shape({
    couponCode: string().required(),
    minAmount: number().required(),
    expireDate: date().required(),
    discountType: string().required(),
    amount: number().required(),
    moneyExpireDate: date().required(),
  });

  const { couponId } = useParams();
  const history = useHistory();
  const [coupon, setCoupon] = useState(null);
  const [loadingCouponButton, setLoadingCouponButton] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(true);
  const [couponDiscountType, setCouponDiscountType] = useState("multiplier");
  const { register, errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const goBack = () => history.push("/admin/coupons");

  useEffect(() => {
    const fetchCoupon = async (couponId) => {
      if (couponId && couponId !== "new") {
        try {
          const couponDocument = await firestore
            .collection("coupons")
            .doc(couponId)
            .get();
          const _coupon = couponDocument.data();

          if (couponDocument.exists) {
            setCoupon(_coupon);
            setCouponDiscountType(_coupon.discountType);
            return setLoadingCoupon(false);
          } else throw new Error();
        } catch (error) {
          message.error("El cupón no existe");
          setLoadingCoupon(false);
          console.error(error);
          return history.push("/admin/coupons");
        }
      }
      const couponRef = await firestore.collection("coupons").doc();

      setCoupon({ id: couponRef.id });

      setLoadingCoupon(false);
    };

    fetchCoupon(couponId);
  }, [couponId, history]);

  const mapCoupon = (coupon) => {
    if (couponId === "new")
      assign(coupon, {
        createAt: new Date(),
      });

    return assign(coupon, {
      couponCode: coupon.couponCode.toUpperCase().trim(),
      minAmount: coupon.minAmount,
      expireDate: coupon.expireDate ? coupon.expireDate : null,
      moneyExpireDate: coupon.moneyExpireDate ? coupon.moneyExpireDate : null,
      couponType: "custom",
      amount: +coupon.amount,
      updateAt: new Date(),
    });
  };

  const couponToFirestore = async (data) => {
    try {
      const mappedCoupon = mapCoupon(assign({}, coupon, data));

      setLoadingCouponButton(true);

      await firestore
        .collection("coupons")
        .doc(coupon.id)
        .set({ ...mappedCoupon });
    } catch (error) {
      console.error(error);
    }
    goBack();
  };

  const showModal = (data) =>
    Modal.confirm({
      title: "Esta seguro del cupón que va a añadir?",
      content: "Esta seguro?",
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk: async () => await couponToFirestore(data),
    });

  const submitCoupon = async (data) =>
    data.expiringMoney ? couponToFirestore(data) : showModal(data);

  const discountTypeProps = () => {
    const props = { min: 0 };

    if (coupon.discountType === "percentage") {
      props.max = 99999;
    }

    return props;
  };

  return loadingCoupon ? (
    spinLoader()
  ) : (
    <CouponContainer>
      <form onSubmit={handleSubmit(submitCoupon)} noValidate>
        <Input
          variant="secondary"
          error={errors.couponCode}
          required
          label="Código"
          type="text"
          autoComplete="on"
          ref={register}
          name="couponCode"
          defaultValue={get(coupon, "couponCode", "")}
          placeholder="Código"
        />
        <Input
          variant="secondary"
          error={errors.minAmount}
          required
          label="Monto minimo para aplicar el cupon"
          type="number"
          autoComplete="on"
          ref={register}
          name="minAmount"
          defaultValue={get(coupon, "minAmount", 0)}
          placeholder="Monto minimo"
        />
        <Controller
          key={get(coupon, "expireDate", "expireDate")}
          name="expireDate"
          control={control}
          defaultValue={
            coupon && coupon.expireDate
              ? moment(coupon.expireDate.toDate())
              : null
          }
          as={
            <DatePicker
              placeholder="Fecha de vencimiento"
              error={errors.expireDate}
              showTime={true}
              style={{ width: "100%" }}
              label="Fecha de vencimiento de cupón"
              format={"DD/MM/YYYY HH:mm:ss"}
              required
            />
          }
        />
        <Controller
          key={get(coupon, "discountType", "discountType")}
          name="discountType"
          defaultValue={get(coupon, "discountType", "multiplier")}
          value={get(coupon, "discountType", "multiplier")}
          control={control}
          as={
            <Select
              variant="secondary"
              required
              error={errors.discountType}
              label="Tipo de descuento"
              onSelect={(value) => setCouponDiscountType(value)}
              showSearch
              placeholder="Tipo de descuento"
            >
              {discountType.map((currency) => (
                <AntSelect.Option key={currency.value} value={currency.type}>
                  {currency.name}
                </AntSelect.Option>
              ))}
            </Select>
          }
        />
        <Input
          variant="secondary"
          error={errors.amount}
          required
          label={
            couponDiscountType === "percentage"
              ? "Porcentaje de incremento de CREDITO"
              : couponDiscountType === "multiplier"
              ? "Numero multiplicador"
              : couponDiscountType === "free"
              ? "Equivale a CREDITO"
              : "Dinero jugable"
          }
          type="text"
          autoComplete="on"
          {...discountTypeProps()}
          ref={register}
          name="amount"
          addonBefore={get(
            discountType[
              findIndex(discountType, (a) => a.type === couponDiscountType)
            ],
            "value",
            null
          )}
          defaultValue={get(coupon, "amount", "")}
          placeholder={
            couponDiscountType === "percentage"
              ? "Porcentaje de incremento de CREDITO"
              : couponDiscountType === "multiplier"
              ? "Numero multiplicador"
              : couponDiscountType === "free"
              ? "Equivale a CREDITO"
              : "Dinero jugable"
          }
        />
        <Controller
          key={get(coupon, "moneyExpireDate", "moneyExpireDate")}
          name="moneyExpireDate"
          control={control}
          defaultValue={
            coupon && coupon.moneyExpireDate
              ? moment(coupon.moneyExpireDate.toDate())
              : null
          }
          as={
            <DatePicker
              placeholder="Fecha de vencimiento"
              error={errors.moneyExpireDate}
              showTime={true}
              style={{ width: "100%" }}
              label="Fecha de vencimiento de money"
              format={"DD/MM/YYYY HH:mm:ss"}
              required
            />
          }
        />
        <div
          style={{ display: "flex", flexDirection: "row", padding: "20px 0" }}
        >
          <label style={{ paddingRight: "20px" }}>Disponible :</label>
          <Checkbox
            checked={get(coupon, "isVisible", false)}
            onClick={() =>
              setCoupon({
                ...coupon,
                isVisible: !get(coupon, "isVisible", false),
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "0px 0px 20px 0px ",
          }}
        >
          <label style={{ paddingRight: "20px" }}>
            Para usuario que no tienen recargas:
          </label>
          <Checkbox
            checked={get(coupon, "chargelessUser", false)}
            onClick={() =>
              setCoupon({
                ...coupon,
                chargelessUser: !get(coupon, "chargelessUser", false),
              })
            }
          />
        </div>
        <div className="buttons">
          <ButtonBombo
            margin="0"
            type="secondary"
            onClick={() => goBack()}
            disabled={loadingCouponButton}
          >
            CANCELAR
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            type="primary"
            htmlType="submit"
            loading={loadingCouponButton}
            disabled={loadingCouponButton}
          >
            AÑADIR
          </ButtonBombo>
        </div>
      </form>
    </CouponContainer>
  );
};

const CouponContainer = styled.div`
  .buttons {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    button {
      margin-right: 5px;
    }
  }
`;
