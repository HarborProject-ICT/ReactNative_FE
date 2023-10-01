const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDZYrbtZ-w_0JuBxumpvITsD-aFZQ-Hmiw",
  authDomain: "coherent-parity-399313.firebaseapp.com",
  projectId: "coherent-parity-399313",
  storageBucket: "coherent-parity-399313.appspot.com",
  messagingSenderId: "117621655611",
  appId: "1:117621655611:web:82e55da05a274c873ab41e",
  measurementId: "G-BES7R5NK43"
};

initializeApp();

const db = getFirestore();

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
async function updateFirestoreData() {
  try {
    const res = await db.collection('cargos').doc('cargoName1').set({
      cargoName: 'NewCargoName',
      cargoPort: 'NewCargoPort',
      cargoShip: 'NewCargoShip'
    });
    console.log('Firestore data updated:', res);
  } catch (error) {
    console.error('Error updating Firestore data:', error);
  }
}

// Call the async function
updateFirestoreData();