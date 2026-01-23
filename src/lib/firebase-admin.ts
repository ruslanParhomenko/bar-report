import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: `firebase-adminsdk-fbsvc@${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      ).trim(),
    }),
  });
}

export const dbAdmin = admin.firestore();
