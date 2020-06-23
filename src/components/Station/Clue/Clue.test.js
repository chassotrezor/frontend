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
      rawHtml: 'testText'
    },
    {
      type: 'image',
      url: 'testSrc'
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
      actions: {
        saveClueAccess: jest.fn()
      },
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
  it('saves access for this clue for this user on the server', () => {
    expect(store.modules.chase.actions.saveClueAccess).toHaveBeenCalled()
  })

  it('displays as many "ClueImage" components as rows with type "image" in clue', () => {
    const clueTexts = wrapper.findAll('.ClueImage_test')
    expect(clueTexts.length).toBe(nbRowsOfType('image'))
  })

  it('displays as many "ClueText" components as rows with type "text" in clue', () => {
    const clueTexts = wrapper.findAll('.ClueText_test')
    expect(clueTexts.length).toBe(nbRowsOfType('text'))
  })
})
