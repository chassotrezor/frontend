import * as QRCode from 'qrcode'

export function generateString (trailId, stationId) {
  return `https://chassotrezor.web.app/station/${trailId}/${stationId}`
}

function getPart (code, index) {
  const parts = code.split('/')
  return parts[index]
}

export function getTrailId (code) {
  return getPart(code, 4)
}

export function getStationId (code) {
  return getPart(code, 5)
}

export function checkCodeValidity (code) {
  const anyString = 'anyString'
  const expectedParts = ['https:', '', 'chassotrezor.web.app', 'station', anyString, anyString]
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

export function generateQrCodeAsDataUrl (trailId, stationId, color) {
  let qrCode = ''
  QRCode.toDataURL(
    generateString(trailId, stationId),
    {
      errorCorrectionLevel: 'L',
      type: 'image/png',
      margin: 4,
      scale: 8,
      color
    },
    (error, url) => {
      if (error) throw error
      qrCode = url
    }
  )
  return qrCode
}
