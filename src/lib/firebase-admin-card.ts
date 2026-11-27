import { cert, getApp, getApps, initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const APP_NAME = "card-app";

const PART_CARD_2 =
  "KBgQD0p3KGPHEXl6AMq3w2lhDSwEtgqN0x+Nif\nf1yPXkD2EmghIud/v+2i2SCrX4GkkR5VL06WteOMbQ+Ri7pYBAHllyo3rBUy0XdW\nLwX8wyaRXSDqARL4WOitd3PIvaFYEbQfsY37omPtt2SZpvr4pg2vZQqA3LeeAN0E\nyMxuFL23bwKBgHlgw4VeZdHqm1s4vlbjBV+jJhl0/nOPbbUvMNVNVoZFCw1uGFBG\nZLR5VYhQ6m8UKKwBRwzFLKwx3w7rNVmJmQf6RH1PVtB7CcdBy7yHWir2g+FI6iQb\n6EQEhezJ74bcbWw5WMEjpvpHs0PqKgTTdjH0rdPYp+hbTR68xdzRqwdxAoGBANBY\npSQB5wGDY45Gn4JQ68S+c7K+O5jp5Xh22tlRGBs2c6z8b48QYIwVQkgPDnWaC+3Z\nWqDoBv84hVCaYLfBuefOgupkRq0/StR/OScW/go+99+vyHrsJEJNfrHOI8+/S9jN\nuS85DMaNLkPXutTzfKYIcxhoXopVC+OeKNH6IdJ";

const FIREBASE_CARD_KEY_4 = "-----END PRIVATE KEY-----\n";

const ID_CARD = "card-tech-cucina";
const privateKeyBar =
  (process.env.FIREBASE_PRIVATE_CARD_KEY_1 ?? "") +
  PART_CARD_2 +
  (process.env.FIREBASE_PRIVATE_CARD_KEY_3 ?? "") +
  FIREBASE_CARD_KEY_4;
const normalizedPrivateKeyBar = privateKeyBar.replace(/\\n/g, "\n").trim();

const app = getApps().some((a) => a.name === APP_NAME)
  ? getApp(APP_NAME)
  : initializeApp(
      {
        credential: cert({
          projectId: ID_CARD,
          clientEmail: `firebase-adminsdk-fbsvc@${ID_CARD}.iam.gserviceaccount.com`,
          privateKey: normalizedPrivateKeyBar,
        }),
      },
      APP_NAME,
    );

export const dbCardAdmin = getFirestore(app);
