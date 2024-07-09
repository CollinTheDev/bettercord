// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAOK2H7XklP-_ng407mj___hy3Fy9InNtk",
  authDomain: "bettercord-e4e7d.firebaseapp.com",
  projectId: "bettercord-e4e7d",
  storageBucket: "bettercord-e4e7d.appspot.com",
  messagingSenderId: "934430756781",
  appId: "1:934430756781:web:faedd45b79251803721b24"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
