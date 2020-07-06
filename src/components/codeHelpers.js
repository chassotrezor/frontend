export function generateString (trailId, stationId) {
  return `https://chassotrezor.web.app/trail/${trailId}/station/${stationId}`
}

function getPart (code, index) {
  const parts = code.split('/')
  return parts[index]
}

export function gettrailId (code) {
  return getPart(code, 4)
}

export function getstationId (code) {
  return getPart(code, 6)
}

export function checkCodeValidity (code) {
  const anyString = 'anyString'
  const expectedParts = ['https:', '', 'chassotrezor.web.app', 'trail', anyString, 'station', anyString]
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
