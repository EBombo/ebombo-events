import {createDocument} from "./createDocument";
import {updateDocument} from "./updateDocument";
import {deleteDocument} from "./deleteDocument";
import {setDocument} from "./setDocument";
import {fetchCollection} from "./fetchCollection";
import {default as yup} from "./yup";
import {
    advertisementsStorageBucket,
    auth,
    claimsStorageBucket,
    config,
    documentsStorageBucket,
    firestore,
    gamesStorageBucket,
    landingsStorageBucket,
    landingStorageBucket,
    settingsStorageBucket,
    storage,
    tournamentsStorageBucket,
    tournamentTeamsStorageBucket,
    usersStorageBucket,
} from "./config";

export {
  createDocument,
  updateDocument,
  deleteDocument,
  fetchCollection,
  setDocument,
  firestore,
  storage,
  documentsStorageBucket,
  claimsStorageBucket,
  advertisementsStorageBucket,
  gamesStorageBucket,
  usersStorageBucket,
  landingStorageBucket,
  landingsStorageBucket,
  tournamentsStorageBucket,
  tournamentTeamsStorageBucket,
  settingsStorageBucket,
  auth,
  config,
  yup,
};
