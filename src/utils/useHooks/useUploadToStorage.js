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
  default: storageDefault,
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
    file,
    path,
    fileName,
    fileSuffix,
    bucket,
    maxAge,
    type
  ) =>
    new Promise((resolve) => {
      const storage = get(buckets, `${bucket}`, landingsStorageBucket);

      const uploadTask = type.includes("image")
        ? storage
            .ref(`${path}/${fileName}.${fileSuffix}`)
            .putString(file, "base64", {
              contentType: type,
              cacheControl: `public,max-age=${
                maxAge > 1 ? maxAge * 86400 : 3200
              }`,
            })
        : storage.ref(`${path}/${fileName}.${fileSuffix}`).put(file);

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
      bucket = "landings",
      maxAge = 0,
      type
    ) =>
      uploadToStorageAndGetURL(
        image,
        path,
        fileName,
        fileSuffix,
        bucket,
        maxAge,
        type
      ),
  };
};
