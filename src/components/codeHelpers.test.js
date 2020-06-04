import {
  generateString,
  getChaseID,
  getClueID,
  checkCodeValidity
} from './codeHelpers'

describe('codeHelpers.js', () => {
  const testChaseID = 'testChaseID'
  const testClueID = 'testClueID'

  test('generateString and (getChaseID, getClueID) are inverse functions', () => {
    const codeString = generateString(testChaseID, testClueID)
    const inverseChaseID = getChaseID(codeString)
    const inverseClueID = getClueID(codeString)
    expect([inverseChaseID, inverseClueID]).toEqual([testChaseID, testClueID])
  })

  describe('checkCodeValidity checks if code has format "*:*"', () => {
    const validCodes = ['a:b', 'abcd:efgh']
    const invalidCodes = ['ab', 'ab:', ':ab', ':ab:']
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
