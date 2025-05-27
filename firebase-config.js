// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyB1N8Ruu_5EIBT_AJrnpUfxLUOhkIb9u8U",
  authDomain: "ticktacik.firebaseapp.com",
  projectId: "ticktacik",
  storageBucket: "ticktacik.firebasestorage.app",
  messagingSenderId: "127431284430",
  appId: "1:127431284430:web:98dd19a0266fd281f3229f",
  measurementId: "G-VCVH2SCKY0"
};

// Inicializa Firebase no modo compatibilidade (para usar com scripts tradicionais)
firebase.initializeApp(firebaseConfig);

// Obtenha as referências principais
const db = firebase.firestore();
const auth = firebase.auth();