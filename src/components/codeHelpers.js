export function generateString (chaseID, clueID) {
  return `${chaseID}:${clueID}`
}

function getPart (code, index) {
  const parts = code.split(':')
  return parts[index]
}

export function getChaseID (code) {
  return getPart(code, 0)
}

export function getClueID (code) {
  return getPart(code, 1)
}

export function checkCodeValidity (code) {
  const parts = code.split(':')
  const hasCorrectPartsAmount = parts.length === 2
  const partsHaveCorrectFormat = parts.every(part => {
    const hasCorrectLength = part.length > 0
    return hasCorrectLength
  })
  return hasCorrectPartsAmount && partsHaveCorrectFormat
}
