// firebase.config.ts
import * as admin from 'firebase-admin';

const serviceAccount = require('../../firebase.json');

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
};

export const firebaseAdmin = admin.initializeApp(firebaseConfig);
