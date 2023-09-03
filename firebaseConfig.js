import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE",
  authDomain: "testproject-a435c.firebaseapp.com",
  databaseURL: "https://testproject-a435c-default-rtdb.firebaseio.com",
  projectId: "testproject-a435c",
  storageBucket: "testproject-a435c.appspot.com",
  messagingSenderId: "517000897185",
  appId: "1:517000897185:web:cdd0b1f5728cab72c486e0"
};

// Initialize Firebase
let app;
if(firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const user = auth.currentUser;

let userEmail = null; // userEmail 변수 선언 및 초기화

// 사용자 인증 상태 변경 감지
auth.onAuthStateChanged((user) => {
  if (user) {
    // 사용자가 로그인한 경우
    userEmail = user.email;
    console.log('User email:', userEmail);
  } else {
    // 사용자가 로그아웃한 경우 또는 로그인하지 않은 경우
    userEmail = null;
    console.log('No user is signed in.');
  }
});

// userEmail 값을 가져오는 함수
export function getUserEmail() {
  return userEmail;
}

export { auth, firestore };

