import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCw-7uYM0FKqXn4K_Af8PUTyHm1pnlaV3Q',
  authDomain: 'chassotrezor-7fd5d.firebaseapp.com',
  databaseURL: 'https://chassotrezor-7fd5d.firebaseio.com',
  projectId: 'chassotrezor-7fd5d',
  storageBucket: 'chassotrezor-7fd5d.appspot.com',
  messagingSenderId: '814807799903',
  appId: '1:814807799903:web:14311f02afd1010852a3ea',
  measurementId: 'G-2GW7YPHNE6'
}

firebase.initializeApp(firebaseConfig)

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
firebase.auth().languageCode = 'fr'
