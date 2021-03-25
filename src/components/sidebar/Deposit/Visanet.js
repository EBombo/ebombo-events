import {config} from "../../../firebase";
import {message} from "antd";
import get from "lodash/get";
import Enc from "enc";
import moment from "moment";

let name = "Integraciones";
let lastName = "VisaNet";
let email = "integraciones.visanet@necomplus.com";
let merchantId = config.visanet.merchantId; //"650175093"

export const generateToken = async (
  coupon,
  amount,
  currency,
  purchaseNumber,
  user,
  userLocation,
  setLoadingNuibizResources
) => {
  const credentials = Enc.base64.encode(
    `${config.visanet.user}:${config.visanet.password}`
  );

  try {
    const response = await fetch(config.visanet.urlApiSeguridad, {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) throw Error(response.statusText);

    const token = await response.text();

    await generateSession(
      token,
      coupon,
      amount,
      currency,
      purchaseNumber,
      user,
      userLocation,
      setLoadingNuibizResources
    );
  } catch (error) {
    console.error(error);
    message.error("Algo salio mal, intente nuevamente", 5);
  }
};

const generateSession = async (
  token,
  coupon,
  amount,
  currency,
  purchaseNumber,
  user,
  userLocation,
  setLoadingNuibizResources
) => {
  let data = {
    amount,
    antifraud: config.currentEnvironment.includes("production")
      ? {
          clientIp: get(userLocation, "ip", null),
          merchantDefineData: {
            MDD4: user.email,
            MDD21: 1,
            MDD32: user.id,
            MDD70: true,
            MDD75: "Registrado",
            MDD77: moment().diff(moment(user.createAt.toDate()), "days"),
          },
        }
      : null,
    channel: "web",
    recurrenceMaxAmount: null,
  };

  console.log("data->", data);

  try {
    const response = await fetch(config.visanet.urlApiSesion + merchantId, {
      crossDomain: true,
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw Error(response.statusText);

    const responseJSON = await response.json();

    generateButton(
      responseJSON["sessionKey"],
      token,
      coupon,
      amount,
      currency,
      purchaseNumber,
      user,
      setLoadingNuibizResources
    );
  } catch (error) {
    console.error(error);
  }
};

const generateButton = (
  sessionKey,
  token,
  coupon,
  amount,
  currency,
  purchaseNumber,
  user,
  setLoadingNuibizResources
) => {
  if (config.currentEnvironment.includes("production")) {
    name = user.name;
    lastName = user.lastName;
    email = user.email;
  }

  const json = {
    merchantId: merchantId,
    moneda: currency,
    nombre: name,
    apellido: lastName,
    importe: amount,
    email: email,
  };

  localStorage.setItem("data", JSON.stringify(json));

  let form = document.createElement("form");

  form.setAttribute("method", "post");

  coupon
    ? form.setAttribute(
        "action",
        `${config.serverUrl}/users/${user.id}/token/${token}/amount/${amount}/currency/${currency}/purchase-number/${purchaseNumber}/coupon/${coupon.coupon.id}/procesar_pago`
      )
    : form.setAttribute(
        "action",
        `${config.serverUrl}/users/${user.id}/token/${token}/amount/${amount}/currency/${currency}/purchase-number/${purchaseNumber}/procesar_pago`
      );

  form.setAttribute("id", "boton_pago");

  document.getElementById("btn_pago").appendChild(form);

  let scriptEl = document.createElement("script");

  scriptEl.setAttribute("src", config.visanet.urlJs);
  scriptEl.setAttribute("data-sessiontoken", sessionKey);
  scriptEl.setAttribute("data-merchantid", merchantId);
  scriptEl.setAttribute(
    "data-merchantlogo",
    "https://storage.googleapis.com/bombo-sport-dev.appspot.com/resources/imalogo-green.svg"
  );
  scriptEl.setAttribute("data-showamount", "true");
  scriptEl.setAttribute("data-purchasenumber", purchaseNumber);
  scriptEl.setAttribute("data-channel", "web");
  scriptEl.setAttribute("data-amount", amount);
  scriptEl.setAttribute("data-cardholdername", name);
  scriptEl.setAttribute("data-cardholderlastname", lastName);
  scriptEl.setAttribute("data-cardholderemail", user.email);
  scriptEl.setAttribute(
    "data-timeouturl",
    `${window.location.href}?tab=top-up-money#right-menu`
  );
  setLoadingNuibizResources(false);
  document.getElementById("boton_pago").appendChild(scriptEl);
};
