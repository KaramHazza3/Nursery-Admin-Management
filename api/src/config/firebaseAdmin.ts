import * as admin from 'firebase-admin';
import serviceAccount from '../../config/ServiceAccountKey.json';
import type { ServiceAccount } from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();
