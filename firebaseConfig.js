import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZYrbtZ-w_0JuBxumpvITsD-aFZQ-Hmiw",
  authDomain: "coherent-parity-399313.firebaseapp.com",
  projectId: "coherent-parity-399313",
  storageBucket: "coherent-parity-399313.appspot.com",
  messagingSenderId: "117621655611",
  appId: "1:117621655611:web:82e55da05a274c873ab41e",
  measurementId: "G-BES7R5NK43"
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

function generateRandomData() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let cargoName = '';
  let cargoPort = '';
  let cargoShip = '';

  // 원하는 길이만큼 무작위 문자 선택
  for (let i = 0; i < 6; i++) {
    cargoName += characters.charAt(Math.floor(Math.random() * characters.length));
    cargoPort += characters.charAt(Math.floor(Math.random() * characters.length));
    cargoShip += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return { cargoName, cargoPort, cargoShip };
}

async function addRandomData() {
  for (let i = 0; i < 10; i++) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let cargoName = '';
    let cargoPort = '';
    let cargoShip = '';

    // 원하는 길이만큼 무작위 문자 선택
    for (let i = 0; i < 6; i++) {
      cargoName += characters.charAt(Math.floor(Math.random() * characters.length));
      cargoPort += characters.charAt(Math.floor(Math.random() * characters.length));
      cargoShip += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Firestore에 데이터 추가
    await firestore.collection('cargos').doc(cargoName).add({
      cargoName: cargoName,
      cargoPort: cargoPort,
      cargoShip: cargoShip
    });
    console.log(`Data ${i + 1} 추가됨`);
  }
}


export { auth, firestore, addRandomData };

