import { mountQuasar } from '@test'
import EditorNavigation from './EditorNavigation'

const testChaseId = 'testChaseId'
const testClueId = 'testClueId'

const $route = {
  params: {}
}

const $router = {
  push: route => {
    $route.params = route.params
  }
}

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        bindMyChases: jest.fn(),
        unbindMyChases: jest.fn(),
        bindClues: jest.fn(),
        unbindClues: jest.fn()
      },
      getters: {
        getChase: state => () => state.chaseId,
        getClue: state => () => state.clueId
      },
      mutations: {
        setChase: (state, chaseId) => {
          state.chaseId = chaseId
        },
        setClue: (state, clueId) => {
          state.clueId = clueId
        }
      },
      state: () => {
        return {
          chaseId: undefined,
          clueId: undefined
        }
      }
    }
  }
}

describe('EditorNavigation', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(EditorNavigation, {
      store,
      mocks: {
        $route,
        $router
      }
    })
    wrapper.vm.$nextTick(done)
  })

  it('starts listening to MyChases on server', () => {
    expect(store.modules.editor.actions.bindMyChases).toHaveBeenCalled()
  })

  it('displays a "ChasesList" component', () => {
    const myChases = wrapper.find('.ChasesList_test')
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

  describe('when "ChasesList" emits "open" with "chaseId" param', () => {
    beforeAll(async () => {
      const myChases = wrapper.find('.ChasesList_test')
      myChases.vm.$emit('open', testChaseId)
      await wrapper.vm.$nextTick()
      wrapper.vm.$store.commit('editor/setChase', $route.params.chaseId)
      await wrapper.vm.$nextTick()
    })

    it('displays no "ChasesList" component', () => {
      const myChases = wrapper.find('.ChasesList_test')
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
      beforeAll(async () => {
        const chaseEditor = wrapper.find('.ChaseEditor_test')
        chaseEditor.vm.$emit('editClue', testClueId)
        await wrapper.vm.$nextTick()
        wrapper.vm.$store.commit('editor/setClue', $route.params.clueId)
        await wrapper.vm.$nextTick()
      })

      it('displays no "ChasesList" component', () => {
        const myChases = wrapper.find('.ChasesList_test')
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

  /*
    TODO: find a way to trigger the $route watcher
    https://stackoverflow.com/questions/47835426/how-to-unit-test-vuejs-watcher-on-route
  */

  // describe('when route changes', () => {
  //   beforeAll(async () => {
  //     wrapper.vm.$set(wrapper.vm.$route, 'params', {
  //       chaseId: 'newId',
  //       clueId: 'newId'
  //     })
  //     await wrapper.vm.$nextTick()
  //   })
  // })

  describe('when it is destroyed', () => {
    beforeAll(done => {
      wrapper.vm.$nextTick(done)
      wrapper.destroy()
    })

    it('stops listening to MyChases on server', () => {
      expect(store.modules.editor.actions.unbindMyChases).toHaveBeenCalled()
    })

    it('stops listening to clues of selected Chase on server if a chase is selected', () => {
      expect(store.modules.editor.actions.unbindClues).toHaveBeenCalledWith(
        expect.any(Object),
        { chaseId: testChaseId }
      )
    })
  })
})
