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

  it('displays a "EditChase" component for each chase I created', () => {
    const myChases = wrapper.findAll('.EditChase_test')
    expect(myChases.length).toBe(Object.keys(testChases).length)
  })

  describe('when "EditChase" component emits "open"', () => {
    beforeAll(done => {
      const editChase = wrapper.find('.EditChase_test')
      editChase.vm.$emit('open')
      wrapper.vm.$nextTick(done)
    })

    it('emits "open" event with "chaseId" parameter', () => {
      expect(wrapper.emitted('open')[0][0]).toBe(testChases[0].id)
    })
  })
})
