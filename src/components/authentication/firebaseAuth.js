import firebase from 'firebase/app'

export const getRedirectResult = () => firebase.auth().getRedirectResult()

export const isSignInWithFirebaseEmailLink = () => firebase.auth().isSignInWithEmailLink(location.href)

export const sendSignInLinkToEmail = email => {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8081/sign/' : 'https://chassotrezor.web.app/sign/'
  const actionCodeSettings = {
    url,
    handleCodeInApp: true
  }
  return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
}

export const signInWithEmailLink = email => firebase.auth().signInWithEmailLink(email, location.href)

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  return firebase.auth().signInWithRedirect(provider)
}

export const signOut = () => firebase.auth().signOut()
