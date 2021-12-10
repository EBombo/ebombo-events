import { firestore, functions } from "../firebase";

export const sendToCheckout = async (userId, priceId) => {
  const docRef = await firestore
    .collection('customers')
    .doc(userId)
    .collection('checkout_sessions')
    .add({
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

  // Wait for the CheckoutSession to get attached by the extension
  docRef.onSnapshot((snap) => {
    const { error, url } = snap.data();
    if (error) {
      // Show an error to your customer and
      // inspect your Cloud Function logs in the Firebase console.
      alert(`An error occured: ${error.message}`);
    }
    if (url) {
      // We have a Stripe Checkout URL, let's redirect.
      window.location.assign(url);
    }
  });
};

const createPortalLink = functions.httpsCallable('ext-firestore-stripe-payments-createPortalLink');

export const goToPortalLink = () => {
  createPortalLink({returnUrl: window.location.origin}) 
    .then((response) => {
      window.location.assign(response.data.url);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const formatAmount = (price) => (price / 100)?.toFixed(2);

