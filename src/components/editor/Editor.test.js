import { mountQuasar } from '@test'
import Editor from './Editor'

const testChaseId = 'testChaseId'
const testClueId = 'testClueId'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        bindMyChases: jest.fn(),
        unbindMyChases: jest.fn()
      }
    }
  }
}

describe('Editor', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(Editor, {
      store
    })
    wrapper.vm.$nextTick(done)
  })

  it('starts listening to MyChases on server', () => {
    expect(store.modules.editor.actions.bindMyChases).toHaveBeenCalled()
  })

  it('displays a "MyChases" component', () => {
    const myChases = wrapper.find('.MyChases_test')
    expect(myChases.exists()).toBe(true)
  })

  it('displays no "ChaseEditor" component', () => {
    const chaseEditor = wrapper.find('.ChaseEditor_test')
    expect(chaseEditor.exists()).toBe(false)
  })

  it('displays no "ClueEditor" component', () => {
    const clueEditor = wrapper.find('.ClueEditor_test')
    expect(clueEditor.exists()).toBe(false)
  })

  describe('when "MyChases" emits "open" with "chaseId" param', () => {
    beforeAll(done => {
      const myChases = wrapper.find('.MyChases_test')
      myChases.vm.$emit('open', testChaseId)
      wrapper.vm.$nextTick(done)
    })

    it('displays no "MyChases" component', () => {
      const myChases = wrapper.find('.MyChases_test')
      expect(myChases.exists()).toBe(false)
    })

    it('displays a "ChaseEditor" component with "chase-id" prop set to "chaseId"', () => {
      const chaseEditor = wrapper.find('.ChaseEditor_test')
      expect(chaseEditor.props().chaseId).toBe(testChaseId)
    })

    it('displays no "ClueEditor" component', () => {
      const clueEditor = wrapper.find('.ClueEditor_test')
      expect(clueEditor.exists()).toBe(false)
    })

    describe('when "ChaseEditor" emits "editClue" with value "clueId"', () => {
      beforeAll(done => {
        const chaseEditor = wrapper.find('.ChaseEditor_test')
        chaseEditor.vm.$emit('editClue', testClueId)
        wrapper.vm.$nextTick(done)
      })

      it('displays no "MyChases" component', () => {
        const myChases = wrapper.find('.MyChases_test')
        expect(myChases.exists()).toBe(false)
      })

      it('displays no "ChaseEditor" component', () => {
        const chaseEditor = wrapper.find('.ChaseEditor_test')
        expect(chaseEditor.exists()).toBe(false)
      })

      it('displays a "ClueEditor" component', () => {
        const clueEditor = wrapper.find('.ClueEditor_test')
        expect(clueEditor.exists()).toBe(true)
      })
    })
  })

  describe('when it is destroyed', () => {
    beforeAll(done => {
      wrapper.vm.$nextTick(done)
      wrapper.destroy()
    })

    it('stops listening to MyChases on server', () => {
      expect(store.modules.editor.actions.unbindMyChases).toHaveBeenCalled()
    })
  })
})
