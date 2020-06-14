import { mountQuasar } from '@test'
import MyChases from './MyChases'

const testChases = {
  testChase1: {},
  testChase2: {}
}

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myChases: () => testChases
      },
      actions: {
        downloadMyChases: jest.fn()
      }
    }
  }
}
describe('MyChases', () => {
  let wrapper

  beforeAll(done => {
    wrapper = mountQuasar(MyChases, {
      store
    })
    wrapper.vm.$nextTick(done)
  })

  it('downloads my chases when mounted', () => {
    expect(store.modules.editor.actions.downloadMyChases).toHaveBeenCalled()
  })

  it('displays a "Chaselink" component for each chase I created', () => {
    const myChases = wrapper.findAll('.ChaseLink_test')
    expect(myChases.length).toBe(Object.keys(testChases).length)
  })
})
