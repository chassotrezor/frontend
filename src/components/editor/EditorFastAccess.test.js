import { mountQuasar } from '@test'
import EditorFastAccess from './EditorFastAccess'

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myChases: () => {
          return {}
        },
        getChase: () => () => {
          return {
            name: 'testChaseName',
            id: 'testChaseId',
            chaseScheme: {}
          }
        }
      }
    }
  }
}

describe('EditorFastAccess', () => {
  const wrapper = mountQuasar(EditorFastAccess, {
    store,
    propsData: {
      chaseId: 'testChaseId'
    }
  })

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
