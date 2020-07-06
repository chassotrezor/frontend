import {
  generateString,
  gettrailId,
  getclueId,
  checkCodeValidity
} from './codeHelpers'

describe('codeHelpers.js', () => {
  const testtrailId = 'testtrailId'
  const testclueId = 'testclueId'

  test('generateString and (gettrailId, getclueId) are inverse functions', () => {
    const codeString = generateString(testtrailId, testclueId)
    const inverseTrailId = gettrailId(codeString)
    const inverseClueId = getclueId(codeString)
    expect([inverseTrailId, inverseClueId]).toEqual([testtrailId, testclueId])
  })

  describe('checkCodeValidity checks if code has format "https://chassotrezor.web.app/trail/trailId/clue/clueId"', () => {
    const validCodes = ['https://chassotrezor.web.app/trail/trailId/clue/clueId']
    const invalidCodes = [
      'http://chassotrezor.web.app/trail/trailId/clue/clueId',
      'https://chassotrezor.web.app/trail//clue/clueId',
      'https://chassotrezor.web.app/trail/trailId/clue/'
    ]
    for (let i = 0; i < validCodes.length; i++) {
      test('valid codes', () => {
        const checks = validCodes.map(code => checkCodeValidity(code))
        const expectations = validCodes.map(() => true)
        expect(checks).toEqual(expectations)
      })
    }
    for (let i = 0; i < invalidCodes.length; i++) {
      test('invalid codes', () => {
        const checks = invalidCodes.map(code => checkCodeValidity(code))
        const expectations = invalidCodes.map(() => false)
        expect(checks).toEqual(expectations)
      })
    }
  })
})
