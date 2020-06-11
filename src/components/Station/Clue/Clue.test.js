import { mountQuasar } from '@test'
import Clue from './Clue'

const chaseId = 'testChaseId'
const clueId = 'testClueId'

const clue = {
  title: 'Test Clue Title',
  isChaseEntry: false,
  rows: [
    {
      type: 'text',
      value: 'testText'
    }
  ]
}

function nbRowsOfType (type) {
  const filteredRows = clue.rows.filter(row => row.type === type)
  return filteredRows.length
}

const $route = {
  params: {
    chaseId,
    clueId
  }
}

const store = {
  modules: {
    chase: {
      namespaced: true,
      getters: {
        getClue: () => jest.fn(() => clue)
      },
      state: () => {}
    }
  }
}
const wrapper = mountQuasar(Clue, {
  store,
  mocks: {
    $route
  }
})

describe('Clue', () => {
  it('displays as many "ClueText" components as rows with type "text" in clue', () => {
    const clueTexts = wrapper.findAll('.clueText_test')
    expect(clueTexts.length).toBe(nbRowsOfType('text'))
  })
})
