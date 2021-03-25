import {
  landingsStorageBucket,
  advertisementsStorageBucket,
  claimsStorageBucket,
  documentsStorageBucket,
  gamesStorageBucket,
  landingStorageBucket,
  storage as storageDefault,
  tournamentsStorageBucket,
  tournamentTeamsStorageBucket,
  usersStorageBucket,
  settingsStorageBucket,
} from "../../firebase";
import get from "lodash/get";

const buckets = {
  claims: claimsStorageBucket,
  documents: documentsStorageBucket,
  advertisements: advertisementsStorageBucket,
  games: gamesStorageBucket,
  users: usersStorageBucket,
  landing: landingStorageBucket,
  landings: landingsStorageBucket,
  tournaments: tournamentsStorageBucket,
  tournamentTeams: tournamentTeamsStorageBucket,
  settings: settingsStorageBucket,
};

export const useUploadToStorage = () => {
  const uploadToStorageAndGetURL = (
    image,
    path,
    fileName,
    fileSuffix,
    bucket
  ) =>
    new Promise((resolve) => {
      const storage = get(buckets, `${bucket}`, landingsStorageBucket);
      const uploadTask = storage
        .ref(`${path}/${fileName}.${fileSuffix}`)
        .putString(image, "base64", { contentType: `image/${fileSuffix}` });

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        async () => {
          const _fileUrl = await storage
            .ref(`/${path}`)
            .child(`${fileName}.${fileSuffix}`)
            .getDownloadURL();

          resolve(_fileUrl);
        }
      );
    });

  return {
    uploadToStorageAndGetURL: (
      image,
      path,
      fileName,
      fileSuffix,
      bucket = "landings"
    ) => uploadToStorageAndGetURL(image, path, fileName, fileSuffix, bucket),
  };
};
