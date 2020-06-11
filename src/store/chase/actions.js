import firebase from 'firebase/app'

function getChaseRef (chaseId) {
  return firebase.firestore().collection('chases').doc(chaseId)
}

function getClueRef (chaseId, clueId) {
  return getChaseRef(chaseId).collection('clues').doc(clueId)
}

// TODO: change promise to async function if possible
export function downloadClue ({ commit }, { chaseId, clueId }) {
  return new Promise((resolve, reject) => {
    const clueRef = getClueRef(chaseId, clueId)
    clueRef.get()
      .then(doc => {
        commit('setClue', { chaseId, clueId, clue: doc.data() })
        resolve()
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export async function start (__, { chaseId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const openChases = [...doc.data().openChases, chaseId]
      t.update(userRef, { openChases })
    })
    console.log('Transaction success!')
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}

export async function saveClueAccess (__, { chaseId, clueId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const chaseIsOpen = doc.data().openChases.some(id => id === chaseId)
      const currentAccessibleClues = doc.data().accessibleClues
      if (chaseIsOpen) {
        const update = {
          lastChase: chaseId,
          lastClue: clueId
        }
        // TODO: improve checks and case handling
        if (!currentAccessibleClues[chaseId]) {
          const accessibleClues = {
            ...currentAccessibleClues,
            [chaseId]: {
              data: {
                name: 'chase name' // TODO: handle chase data
              },
              clues: {
                [clueId]: {
                  name: 'clue name' // TODO: handle clue data
                }
              }
            }
          }
          update.accessibleClues = accessibleClues
        } else {
          const currentClueIsNotAccessible =
            Object.keys(currentAccessibleClues[chaseId].clues).every(id => id !== clueId)

          if (currentClueIsNotAccessible) {
            const accessibleClues = {
              ...currentAccessibleClues,
              [chaseId]: {
                data: {
                  name: 'chase name' // TODO: handle chase data
                },
                clues: {
                  ...currentAccessibleClues[chaseId].clues,
                  [clueId]: {
                    name: 'clue name' // TODO: handle clue data
                  }
                }
              }
            }
            update.accessibleClues = accessibleClues
          }
        }
        t.update(userRef, update)
      }
    })
    console.log('Transaction success!')
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}
