export const querySnapshotToArray = (snapshot) => {
  const returnArray = [];

  snapshot.forEach((childSnapshot) =>
    returnArray.push({ ...childSnapshot.data(), id: childSnapshot.id })
  );

  return returnArray;
};
