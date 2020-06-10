const defaultIsSignInWithFirebaseEmailLink = jest.fn().mockImplementation(() => false)
const defaultSignInWithEmailLink = jest.fn().mockResolvedValue({ user: null })
const defaultSendSignInLinkToEmail = jest.fn().mockResolvedValue()
const defaultGetRedirectResult = jest.fn().mockResolvedValue({ user: null })
const defaultSignInWithGoogle = jest.fn().mockResolvedValue()
const defaultSignOut = jest.fn().mockResolvedValue()

export let isSignInWithFirebaseEmailLink
export let signInWithEmailLink
export let sendSignInLinkToEmail
export let getRedirectResult
export let signInWithGoogle
export let signOut

export const setIsSignInWithFirebaseEmailLink = implementation => { isSignInWithFirebaseEmailLink = implementation }
export const setSignInWithEmailLink = implementation => { signInWithEmailLink = implementation }
export const setSendSignInLinkToEmail = implementation => { sendSignInLinkToEmail = implementation }
export const setGetRedirectResult = implementation => { getRedirectResult = implementation }
export const setSignInWithGoogle = implementation => { signInWithGoogle = implementation }
export const setSignOut = implementation => { signOut = implementation }

export const restoreFirebaseMock = () => {
  setIsSignInWithFirebaseEmailLink(defaultIsSignInWithFirebaseEmailLink)
  setSignInWithEmailLink(defaultSignInWithEmailLink)
  setSendSignInLinkToEmail(defaultSendSignInLinkToEmail)
  setGetRedirectResult(defaultGetRedirectResult)
  setSignInWithGoogle(defaultSignInWithGoogle)
  setSignOut(defaultSignOut)
}

restoreFirebaseMock()
