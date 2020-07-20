import { generateId, generateIdIn } from './dataHelpers'

describe('dataHelpers', () => {
  test('generateId returns a random String of choosen length', () => {
    for (let i = 4; i < 10; i++) {
      expect(generateId(i).length).toBe(i)
    }
  })

  test('generateIdIn returns a string different of all object keys', () => {
    const object = {}
    for (let i = 0; i < 100; i++) object[generateId(8)] = ''
    const newKey = generateIdIn(object, 8)
    expect(object).not.toContain(newKey)
  })
})
