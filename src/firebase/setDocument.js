import firebase from "firebase";

export const setDocument = (collection, id, object, marge = true) =>
  firebase
    .firestore()
    .collection(collection)
    .doc(id)
    .set(object, { merge: marge });
