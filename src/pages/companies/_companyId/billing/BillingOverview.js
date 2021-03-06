import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import moment from "moment";
import { mediaQuery } from "../../../../constants";
import { PanelBox } from "../../../../components/common/PanelBox";
import {
  BrandCardIcon,
  getCurrencySymbol,
  getTypePaymentPrice,
  stripeDateFormat,
} from "../../../../components/common/DataList";
import { Image } from "../../../../components/common/Image";
import { Anchor } from "../../../../components/form";
import { spinLoader } from "../../../../components/common/loader";
import { StripeCustomerPortalLink } from "../../../../components/StripeCustomerPortalLink";
import { InvoiceTable } from "../invoices/InvoiceTable";
import { formatAmount } from "../../../../stripe";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils";
import { useTranslation } from "../../../../hooks";

export const BillingOverview = (props) => {
  const router = useRouter();
  const { companyId, subscriptionId } = router.query;

  const { t } = useTranslation("pages.billing");

  const [authUser] = useGlobal("user");

  const [subscription, setSubscription] = useState();
  const [invoice, setInvoice] = useState();
  const [paymentInformation, setPaymentInformation] = useState();

  useEffect(() => {
    if (subscription) return;

    const fetchUserSubscriptionQuery = firestore
      .collection(`customers/${authUser.id}/subscriptions`)
      .doc(subscriptionId)
      .get();

    const getSubscription = async () => {
      const _subscription = (await fetchUserSubscriptionQuery).data();

      setSubscription(_subscription);
    };

    return getSubscription();
  }, []);

  useEffect(() => {
    if (invoice) return;

    const getInvoice = async () => {
      const lastInvoiceQuery = await firestore
        .collection(`customers/${authUser.id}/subscriptions/${subscriptionId}/invoices`)
        .orderBy("created", "desc")
        .limit(1)
        .get();

      const invoices = snapshotToArray(lastInvoiceQuery);

      const _invoice = invoices?.[0];
      setInvoice(_invoice);

      const paymentIntent = _invoice["payment_intent"];
      const paymentInformationQuery = await firestore
        .collection(`customers/${authUser.id}/payments`)
        .doc(paymentIntent)
        .get();

      const _paymentInformation = paymentInformationQuery.data();
      setPaymentInformation(_paymentInformation);
    };

    return getInvoice();
  }, []);

  if (!subscription) return spinLoader();

  return (
    <BillingDetailContainer>
      <div className="section">
        <div className="">
          <Anchor variant="primary" onClick={() => router.back()}>
            {t("go-back")}
          </Anchor>
        </div>
        <h2 className="title">Suscripciones</h2>
        <div className="subscriptions-layout">
          <PanelBox className="plan" heading="Plan Anual Billing" elevated margin="0 0 1rem 0">
            <div className="table">
              <div className="label">Periodo actual</div>
              <div className="value">
                {moment(subscription?.current_period_start.toDate()).format(stripeDateFormat)} -
                {moment(subscription?.current_period_end.toDate()).format(stripeDateFormat)}
              </div>

              <div className="label">Comportamiento de t??rmino</div>
              <div className="value">{getTypePaymentPrice[subscription?.items?.[0].price.type]}</div>

              <div className="label">Se renueva en</div>
              <div className="value">{moment(subscription?.current_period_end.toDate()).format(stripeDateFormat)}</div>

              <div className="label">Comenz?? en</div>
              <div className="value">
                {moment(subscription?.current_period_start.toDate()).format(stripeDateFormat)}
              </div>

              <div className="label">??ltima Factura</div>
              <div className="value">
                <Anchor
                  variant="primary"
                  underlined
                  url={`/companies/${companyId}/invoices/${invoice?.id}?subscriptionId=${subscriptionId}`}
                >
                  #{invoice?.number}
                </Anchor>
              </div>
            </div>
            <div className="alert accent">
              <p className="description">
                Siguiente factura en {moment(subscription?.current_period_end.toDate()).format(stripeDateFormat)}
              </p>
              <div className="table">
                <div className="label">{subscription?.items?.[0].price?.product.name}</div>
                <div className="value">
                  {formatAmount(subscription?.items?.[0].plan?.amount)}
                  {getCurrencySymbol[subscription?.items?.[0].plan?.currency]}
                </div>
              </div>
              <hr className="divider" />
              <div className="table">
                <div className="label">Total Actual</div>
                <div className="value">
                  {formatAmount(subscription?.items?.[0].plan?.amount)}
                  {getCurrencySymbol[subscription?.items?.[0].plan?.currency]}
                </div>
              </div>
            </div>
            <div className="right">
              <StripeCustomerPortalLink
                anchorWrapperClassName="absolute bottom-0 left-0 right-0 py-2 px-4 rounded-b-lg bg-secondary text-white"
                anchorClassName="text-white underline"
                variant="primary"
              >
                Cancelar suscripci??n
              </StripeCustomerPortalLink>
            </div>
          </PanelBox>

          <PanelBox className="billing-detail" elevated heading="Datos de facturaci??n" margin="0 0 1rem 0">
            {!paymentInformation ? (
              spinLoader()
            ) : (
              <div className="table">
                <div className="label">Nombre</div>
                <div className="value">{paymentInformation?.charges.data?.[0]?.billing_details?.name}</div>

                <div className="label">Tarjeta de Cr??dito</div>
                <div className="value">
                  <Image
                    className="brand-logo"
                    src={BrandCardIcon[paymentInformation?.charges.data?.[0]?.payment_method_details?.card?.brand]}
                    width="32px"
                  />{" "}
                  &bull; {paymentInformation?.charges.data?.[0]?.payment_method_details?.card?.last4}
                </div>

                <div className="label">Caducidad</div>
                <div className="value">
                  {paymentInformation?.charges.data?.[0]?.payment_method_details?.card?.exp_month} /
                  {paymentInformation?.charges.data?.[0]?.payment_method_details?.card?.exp_year}
                </div>

                <div className="label">Direcci??n</div>
                <div className="value">
                  {paymentInformation?.charges.data?.[0]?.billing_details?.address?.postal_code}
                  {paymentInformation?.charges.data?.[0]?.billing_details?.address?.country}
                </div>
              </div>
            )}
          </PanelBox>
        </div>

        <div className="table">
          <h2 className="title">Facturas</h2>
          <Anchor
            className="action-link"
            variant="primary"
            url={`/companies/${companyId}/invoices?subscriptionId=${subscriptionId}`}
          >
            Ver todas las facturas
          </Anchor>
        </div>

        <InvoiceTable {...props} userId={authUser?.id} subscriptionId={subscriptionId} />
      </div>
    </BillingDetailContainer>
  );
};

const BillingDetailContainer = styled.div`
  .brand-logo {
    display: inline-block;
  }

  .section {
    margin: 12px 8px 0 8px;
    ${mediaQuery.afterTablet} {
      max-width: 1200px;
      margin: 12px auto 0 auto;
    }
  }

  .right {
    text-align: right;
  }

  .table {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .label {
      font-weight: bold;
    }

    .action-link {
      justify-self: end;
      align-self: center;
    }
  }

  .alert {
    margin-top: 18px;
    padding: 1rem;
    border-radius: 8px;

    &.accent {
      background: ${(props) => props.theme.basic.gray};
    }
  }

  .divider {
    border-color: ${(props) => props.theme.basic.grayLighten};
  }

  ${mediaQuery.afterTablet} {
    .subscriptions-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;

      .plan {
        grid-row: 1 / 3;
        grid-column: 1 / 2;
      }

      .billing-detail {
        grid-row: 1 / 3;
        grid-column: 2 / 3;
      }
    }
  }
`;
