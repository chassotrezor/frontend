import {
  generateString,
  getchaseId,
  getclueId,
  checkCodeValidity
} from './codeHelpers'

describe('codeHelpers.js', () => {
  const testchaseId = 'testchaseId'
  const testclueId = 'testclueId'

  test('generateString and (getchaseId, getclueId) are inverse functions', () => {
    const codeString = generateString(testchaseId, testclueId)
    const inversechaseId = getchaseId(codeString)
    const inverseclueId = getclueId(codeString)
    expect([inversechaseId, inverseclueId]).toEqual([testchaseId, testclueId])
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
