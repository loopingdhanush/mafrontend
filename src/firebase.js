import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTS5pZ04NMkDFEhdYzpiKt-NxNVZWJOo8",
  authDomain: "ai-fashion-57f19.firebaseapp.com",
  projectId: "ai-fashion-57f19",
  storageBucket: "ai-fashion-57f19.firebasestorage.app",
  messagingSenderId: "419460928194",
  appId: "1:419460928194:web:25a381d961f0045c79215b"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);