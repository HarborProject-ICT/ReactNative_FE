import axios from 'axios';
import { auth, firestore } from '../firebaseConfig';


const API_KEY = 'AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE'

export async function createUser(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const userEmail = user.email;
        // Create a Firestore document for the user
        await firestore.collection('users').doc(userEmail).set({
          userEmail: userEmail,
          cargoName: 'Cargo Name',
          cargoPort: 'Cargo Port',
          cargoShip: 'Cargo Ship',
          selectedHour: 'Selected Hour',
          selectedTime: 'Selected Time',
        })
        .then(() => {
          console.log('User document created in Firestore');
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

        const cargoQuerySnapshot = await firestore.collection('users').doc(userEmail).get();
        return {
          token: token
        };
      } catch (error) {
        console.log(error);
      }
}

