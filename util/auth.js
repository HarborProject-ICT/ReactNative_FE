import axios from 'axios';
import { auth, firestore } from '../firebaseConfig';


const API_KEY = 'AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE'


export async function createUser(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const userEmail = user.email;
        // Create a Firestore document for the user
        firestore.collection('users').doc(userEmail).set({
          userEmail: userEmail,
        })
        .then(() => {
          console.log('User document created in Firestore');
    
          // 사용자 문서 생성 후, cargos 컬렉션 생성
          firestore.collection('users').doc(userEmail).collection('cargos').add({
            /*
            cargoName: 'Cargo Name',
            cargoPort: 'Cargo Port',
            cargoShip: 'Cargo Ship',
            selectedHour: 'Selected Hour',
            selectedTime: 'Selected Time',
            */
          })
          .then((docRef) => {
            console.log('Cargo added to Firestore with ID: ', docRef.id);
          })
          .catch((error) => {
            console.error('Error adding cargo to Firestore:', error);
          });
        })
        .catch((error) => {
          console.error('Error creating user document in Firestore:', error);
        });
        console.log('Logged-in user email:',userEmail);
        const token = await user.getIdToken();
        email = user.email;
        return {
          token: token,
        };
      } catch (error) {
        console.log(error);
      }
}
  
export async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();

        console.log('Logged-in user email:', userCredential.user.email);
        const userEmail = userCredential.user.email;
        return {
          token: token,
        };
      } catch (error) {
        console.log(error);
      }
}
