import { generateId, generateIdIn } from './dataHelpers'

describe('dataHelpers', () => {
  test('generateId returns a random String of choosen length', () => {
    for (let i = 4; i < 10; i++) {
      expect(generateId(i).length).toBe(i)
    }
  })

  test('generateIdIn on object whithout "pathToValue" returns a string different of all object keys', () => {
    const object = {}
    for (let i = 0; i < 100; i++) object[generateId(8)] = ''
    const newKey = generateIdIn(object, 8)
    expect(object).not.toContain(newKey)
  })

  test('generateIdIn on object with "pathToValue" returns a string different of all values in "object[anyProperty].path.to.value"', () => {
    const object = {}
    for (let i = 0; i < 100; i++) {
      object[generateIdIn(object, 8)] = {
        path: { to: { value: generateIdIn(object, 8, 'path.to.value') } }
      }
    }
    const newKey = generateIdIn(object, 8, 'path.to.value')
    expect(object).not.toContain(newKey)
  })

  test('generateIdIn on array without "pathToValue" returns a string different of all array elements', () => {
    const array = []
    for (let i = 0; i < 100; i++) {
      array[i] = generateIdIn(array, 8)
    }
    const newKey = generateIdIn(array, 8)
    expect(array).not.toContain(newKey)
  })

  test('generateIdIn on array with "pathToValue" returns a string different of all values in "array[anyElement].path.to.value"', () => {
    const array = []
    for (let i = 0; i < 100; i++) {
      array[i] = {
        path: { to: { value: generateIdIn(array, 8, 'path.to.value') } }
      }
    }
    const newKey = generateIdIn(array, 8, 'path.to.value')
    expect(array).not.toContain(newKey)
  })
})
