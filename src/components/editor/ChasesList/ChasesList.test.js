import { mountQuasar } from '@test'
import ChasesList from './ChasesList'

const testChases = {
  testChaseId1: {
    id: 'testChaseId1',
    name: 'testName1'
  },
  testChaseId2: {
    id: 'testChaseId2',
    name: 'testName2'
  }
}

const newChaseId = 'newChaseId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myChases: () => testChases
      },
      actions: {
        createChase: jest.fn().mockResolvedValue(newChaseId)
      }
    }
  }
}
describe('ChasesList', () => {
  let wrapper

  beforeAll(done => {
    wrapper = mountQuasar(ChasesList, {
      store
    })
    wrapper.vm.$nextTick(done)
  })

  it('displays a "ChaseCard" component for each chase I created', () => {
    const myChases = wrapper.findAll('.ChaseCard_test')
    expect(myChases.length).toBe(Object.keys(testChases).length)
  })

  describe('when "ChaseCard" component emits "edit"', () => {
    beforeAll(done => {
      const editChase = wrapper.find('.ChaseCard_test')
      editChase.vm.$emit('edit')
      wrapper.vm.$nextTick(done)
    })

    it('emits "editChase" event with "chaseId" parameter', () => {
      expect(wrapper.emitted().editChase[0][0]).toBe(testChases.testChaseId1.id)
    })
  })

  it('displays a "create chase" button', () => {
    const btn = wrapper.find('.CreateChase_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "create chase" button emits "click"', () => {
    beforeAll(done => {
      const btn = wrapper.find('.CreateChase_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('creates a new chase on the server', () => {
      expect(store.modules.editor.actions.createChase).toHaveBeenCalled()
    })

    it('emits "editChase" event with value "newChaseId"', () => {
      expect(wrapper.emitted().editChase[1][0]).toBe(newChaseId)
    })
  })
})