import {
  generateString,
  gettrailId,
  getstationId,
  checkCodeValidity
} from './codeHelpers'

describe('codeHelpers.js', () => {
  const testtrailId = 'testtrailId'
  const teststationId = 'teststationId'

  test('generateString and (gettrailId, getstationId) are inverse functions', () => {
    const codeString = generateString(testtrailId, teststationId)
    const inverseTrailId = gettrailId(codeString)
    const inverseStationId = getstationId(codeString)
    expect([inverseTrailId, inverseStationId]).toEqual([testtrailId, teststationId])
  })

  describe('checkCodeValidity checks if code has format "https://chassotrezor.web.app/trail/trailId/station/stationId"', () => {
    const validCodes = ['https://chassotrezor.web.app/trail/trailId/station/stationId']
    const invalidCodes = [
      'http://chassotrezor.web.app/trail/trailId/station/stationId',
      'https://chassotrezor.web.app/trail//station/stationId',
      'https://chassotrezor.web.app/trail/trailId/station/'
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
