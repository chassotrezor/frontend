export let isSignInWithFirebaseEmailLink = jest.fn().mockImplementation(() => false)
export const setIsSignInWithFirebaseEmailLink = implementation => { isSignInWithFirebaseEmailLink = implementation }

export let signInWithEmailLink = jest.fn().mockImplementation(() => Promise.resolve())
export const setSignInWithEmailLink = implementation => { signInWithEmailLink = implementation }

export let sendSignInLinkToEmail = jest.fn().mockResolvedValue()
export const setSendSignInLinkToEmail = implementation => { sendSignInLinkToEmail = implementation }

export let getRedirectResult = jest.fn().mockResolvedValue({ user: null })
export const setGetRedirectResult = implementation => { getRedirectResult = implementation }

export let signInWithGoogle = jest.fn().mockImplementation(() => Promise.resolve())
export const setSignInWithGooglesetSignOut = implementation => { signInWithGoogle = implementation }

export let signOut = jest.fn().mockImplementation(() => Promise.resolve())
export const setSignOut = implementation => { signOut = implementation }
