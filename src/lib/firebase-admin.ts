import admin from "firebase-admin";

const PART_2 =
  "5pbQcH/vBIhWHVC/qZOQhqZ6lTHvGTLU1VJ4yMAKwQKBgQD3zR4Zkihswy+OdguP\nScSljNzy5hSSNp0wNuFZLuupaEQPDuwSsBj8ctbUxBfWxRgqsE4Cpc+9uZNARgos\n52pUiqcBsl1c+/aLGUhcV1mTXK8ISQrYcevnWbTGMukU1UkKrQd0i6/vgaQt6Iij\ngxWkNApL1aT2jGfyaEU3dFvaSQKBgQDq/GIFbMBnf1iTP0+OrAHOjjE0upzfX33Z\nUhdchZGH6gfWFqyNgyrux0tvXYctH92MpOhCI4b+MLf7beCjcrweCNT4Ag+Gs6Dn\nFDGTlaKAv0CYLFajv59bTO/Gd6FDoPRNtATiftOjvUD7E7OIoy6S7nUl9LqfGvYy\naVD3+GOy2QKBgQDee6pPuRtUc3aKSNAeKVRGcw+ZghvsHt7IgC2Znff2VOfuQS6R";
const privateKeyBar =
  (process.env.FIREBASE_PRIVATE_KEY_1 ?? "") +
  PART_2 +
  (process.env.FIREBASE_PRIVATE_KEY_3 ?? "") +
  (process.env.FIREBASE_PRIVATE_KEY_4 ?? "");
const normalizedPrivateKeyBar = privateKeyBar.replace(/\\n/g, "\n").trim();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: `firebase-adminsdk-fbsvc@${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      privateKey: normalizedPrivateKeyBar!,
    }),
  });
}

export const dbAdmin = admin.firestore();
