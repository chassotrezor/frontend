console.log('level 0 - root (no async)')
beforeAll(() => console.log('level 0 - beforeAll'))
afterAll(() => console.log('level 0 - afterAll'))
beforeEach(() => console.log('level 0 - beforeEach'))
afterEach(() => console.log('level 0 - afterEach'))
test('', () => {
  console.log('level 0 - test')
  expect(true).toBe(true)
})
describe('  level 1 - describe', () => {
  console.log('  level 1 - describe (no async)')
  beforeAll(() => console.log('  level 1 - beforeAll'))
  afterAll(() => console.log('  level 1 - afterAll'))
  beforeEach(() => console.log('  level 1 - beforeEach'))
  afterEach(() => console.log('  level 1 - afterEach'))
  test('', () => {
    console.log('  level 1 - test')
    expect(true).toBe(true)
  })
  describe('    level 2 - describe', () => {
    console.log('    level 2 - describe (no async)')
    beforeAll(() => console.log('    level 2 - beforeAll'))
    afterAll(() => console.log('    level 2 - afterAll'))
    beforeEach(() => console.log('    level 2 - beforeEach'))
    afterEach(() => console.log('    level 2 - afterEach'))
    test('', () => {
      console.log('    level 2 - test')
      expect(true).toBe(true)
    })
  })
})
