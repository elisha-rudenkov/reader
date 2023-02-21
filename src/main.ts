import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { MotionPlugin } from '@vueuse/motion'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyQ6P5ee64J7_QQBbaNPLKBC-FDKTst6Y",
  authDomain: "reader-234bd.firebaseapp.com",
  projectId: "reader-234bd",
  storageBucket: "reader-234bd.appspot.com",
  messagingSenderId: "333223135649",
  appId: "1:333223135649:web:90f4666be1da34da3ce3e0",
  measurementId: "G-KPK3CJYR9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth(app);

let vue_app: any;

onAuthStateChanged(auth, () => {
  if (!vue_app) {
    vue_app = createApp(App).use(store).use(router).use(MotionPlugin).mount('#app')
  }
});

export { app, db, analytics, functions, auth };
