export function generateString (chaseId, clueId) {
  return `${chaseId}:${clueId}`
}

function getPart (code, index) {
  const parts = code.split(':')
  return parts[index]
}

export function getchaseId (code) {
  return getPart(code, 0)
}

export function getclueId (code) {
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
