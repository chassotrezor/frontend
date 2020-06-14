import { mountQuasar } from '@test'
import MyChases from './MyChases'

const testChases = [
  {
    id: 'testChaseId1',
    name: 'testName1'
  },
  {
    id: 'testChaseId2',
    name: 'testName2'
  }
]

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

  describe('when "ChaseLink" component emits "open"', () => {
    beforeAll(done => {
      const chaseLink = wrapper.find('.ChaseLink_test')
      chaseLink.vm.$emit('open')
      wrapper.vm.$nextTick(done)
    })

    it('emits "open" event with "chaseId" parameter', () => {
      expect(wrapper.emitted('open')[0][0]).toBe(testChases[0].id)
    })
  })
})