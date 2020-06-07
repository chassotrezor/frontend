export function generateString (chaseId, clueId) {
  return `https://chassotrezor.web.app/chase/${chaseId}/clue/${clueId}`
}

function getPart (code, index) {
  const parts = code.split('/')
  return parts[index]
}

export function getchaseId (code) {
  return getPart(code, 4)
}

export function getclueId (code) {
  return getPart(code, 6)
}

export function checkCodeValidity (code) {
  const anyString = 'anyString'
  const expectedParts = ['https:', '', 'chassotrezor.web.app', 'chase', anyString, 'clue', anyString]
  const parts = code.split('/')
  const hasCorrectPartsAmount = parts.length === expectedParts.length
  if (hasCorrectPartsAmount) {
    const partsHaveCorrectFormat = parts.every((part, index) => {
      const expected = expectedParts[index]
      if (expected === anyString) return part.length > 0
      else return part === expected
    })
    return partsHaveCorrectFormat
  } else {
    return false
  }
}
