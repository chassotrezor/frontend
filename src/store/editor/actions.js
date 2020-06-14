import firebase from 'firebase/app'

export function downloadMyChases ({ commit }) {
  const userId = firebase.auth().currentUser.uid
  const chasesRef = firebase.firestore().collection('chases')
  chasesRef.where('editors', 'array-contains', userId).get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnaphot => {
        const chase = {
          ...documentSnaphot.data(),
          id: documentSnaphot.id
        }
        commit('setChase', chase)
      })
    })
}
