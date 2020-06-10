import { mountQuasar } from '@test'
import Clue from './Clue'

describe('Clue', () => {
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

  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
