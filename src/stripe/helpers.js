import { firestore, functions } from "../firebase";

export const sendToCheckout = async (userId, priceId) => {
  const docRef = await firestore
    .collection('customers')
    .doc(userId)
    .collection('checkout_sessions')
    .add({
      price: priceId,
      success_url: window.location.href,
      cancel_url: window.location.href,
    });

  return new Promise((resolve, reject) => {
    docRef.onSnapshot((snap) => {
      const { error, url } = snap.data();
      if (error) reject(error);
      if (url) {
        window.location.assign(url);
        resolve();
      }
    });
  })
};

const createPortalLink = functions.httpsCallable('ext-firestore-stripe-payments-createPortalLink');

export const goToPortalLink = async () => {
  const response = await createPortalLink({returnUrl: window.location.href});
  window.location.assign(response.data.url);
};

export const formatAmount = (price) => +(price / 100)?.toFixed(2);

