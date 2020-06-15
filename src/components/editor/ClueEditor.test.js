import { mountQuasar } from '@test'
import ClueEditor from './ClueEditor'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        updateClueInChase: () => {}
      },
      getters: {
        getClue: () => () => {
          return {
            name: 'testClueName'
          }
        }
      }
    }
  }
}

describe('ClueEditor', () => {
  const wrapper = mountQuasar(ClueEditor, {
    propsData: {
      clueId: 'testClueId',
      chaseId: 'testChaseId'
    },
    store
  })

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
