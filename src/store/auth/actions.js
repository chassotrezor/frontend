import firebase from 'firebase/app'

export function signup (__, { email, password }) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export function signin (__, { email, password }) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}
