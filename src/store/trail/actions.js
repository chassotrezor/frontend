import firebase from 'firebase/app'

function getTrailRef (trailId) {
  return firebase.firestore().collection('trails').doc(trailId)
}

function getClueRef (trailId, clueId) {
  return getTrailRef(trailId).collection('clues').doc(clueId)
}

// TODO: change promise to async function if possible
export function downloadClue ({ commit }, { trailId, clueId }) {
  return new Promise((resolve, reject) => {
    const clueRef = getClueRef(trailId, clueId)
    clueRef.get()
      .then(doc => {
        commit('setClue', { trailId, clueId, clue: doc.data() })
        resolve()
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export async function start (__, { trailId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const openTrails = [...doc.data().openTrails, trailId]
      t.update(userRef, { openTrails })
    })
    console.log('Transaction success!')
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}

export async function saveClueAccess (__, { trailId, clueId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const trailIsOpen = doc.data().openTrails.some(id => id === trailId)
      const currentAccessibleClues = doc.data().accessibleClues
      if (trailIsOpen) {
        const update = {
          lastTrail: trailId,
          lastClue: clueId
        }
        // TODO: improve checks and case handling
        if (!currentAccessibleClues[trailId]) {
          const accessibleClues = {
            ...currentAccessibleClues,
            [trailId]: {
              data: {
                name: 'trail name' // TODO: handle trail data
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
            Object.keys(currentAccessibleClues[trailId].clues).every(id => id !== clueId)

          if (currentClueIsNotAccessible) {
            const accessibleClues = {
              ...currentAccessibleClues,
              [trailId]: {
                data: {
                  name: 'trail name' // TODO: handle trail data
                },
                clues: {
                  ...currentAccessibleClues[trailId].clues,
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
