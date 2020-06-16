import { mountQuasar } from '@test'
import Editor from './Editor'

const testChaseId = 'testChaseId'
const testClueId = 'testClueId'

const $route = {
  params: {}
}

const $router = {
  push: jest.fn()
}

const routes = [
  {
    path: '/editor',
    name: 'editor',
    children: [{
      path: '/editor/:chaseId',
      name: 'chaseEditor',
      children: [{
        path: '/editor/:chaseId/:clueId',
        name: 'clueEditor'
      }]
    }]
  }
]

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
        getChase: () => () => testChaseId,
        getClue: () => () => testClueId
      }
      //   getChase: state => () => state.chaseId,
      //   getClue: state => () => state.clueId
      // },
      // mutations: {
      //   setChase: (state, chaseId) => {
      //     state.chaseId = chaseId
      //   },
      //   setClue: (state, clueId) => {
      //     state.clueId = clueId
      //   }
      // },
      // state: () => {
      //   return {
      //     chaseId: undefined,
      //     clueId: undefined
      //   }
      // }
    }
  }
}

describe('Editor', () => {
  let wrapper

  describe('display logic', () => {
    beforeAll(async () => {
      wrapper = mountQuasar(Editor, {
        store,
        routes
      })
      await wrapper.vm.$nextTick()
    })

    it('displays an "EditorFastAccess" component', () => {
      const fastAccess = wrapper.find('.EditorFastAccess_test')
      expect(fastAccess.exists()).toBe(true)
    })

    describe('when "$route.params" is empty', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'editor'
        })
        await wrapper.vm.$nextTick()
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
    })

    describe('when "route.params.chaseId" exists and "route.params.clueId" does not', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'chaseEditor',
          params: {
            chaseId: testChaseId
          }
        })
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
    })

    describe('when "route.params.chaseId" and "route.params.clueId" exist', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'clueEditor',
          params: {
            chaseId: testChaseId,
            clueId: testClueId
          }
        })
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

    afterAll(() => {
      wrapper.destroy()
      jest.clearAllMocks()
    })
  })

  describe('data access logic', () => {
    beforeAll(async () => {
      wrapper = mountQuasar(Editor, {
        store,
        routes
      })
      await wrapper.vm.$nextTick()
    })

    describe('when mounted', () => {
      it('starts listening to MyChases on server', () => {
        expect(store.modules.editor.actions.bindMyChases).toHaveBeenCalled()
      })
    })

    describe('when "$route.params.chaseId" becomes defined', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'chaseEditor',
          params: {
            chaseId: testChaseId
          }
        })
        await wrapper.vm.$nextTick()
      })

      it('starts listening to changes of clues in chase', () => {
        expect(store.modules.editor.actions.bindClues).toHaveBeenCalledWith(
          expect.any(Object),
          { chaseId: testChaseId }
        )
      })
    })

    describe('when "$route.params.chaseId" becomes undefined', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'editor'
        })
        await wrapper.vm.$nextTick()
      })

      it('stops listening to changes of clues in chase', () => {
        expect(store.modules.editor.actions.unbindClues).toHaveBeenCalledWith(
          expect.any(Object),
          { chaseId: testChaseId }
        )
      })
    })

    describe('when destroyed', () => {
      beforeAll(() => {
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

      afterAll(() => {
        jest.clearAllMocks()
      })
    })
  })

  describe('event handling logic', () => {
    beforeAll(async () => {
      wrapper = mountQuasar(Editor, {
        store,
        mocks: {
          $route,
          $router,
          selectedChase: false,
          selectedClue: false
        }
      })
      await wrapper.vm.$nextTick()
    })

    describe('when "ChasesList" emits "editChase" with "chaseId" param', () => {
      beforeAll(async () => {
        const myChases = wrapper.find('.ChasesList_test')
        myChases.vm.$emit('editChase', testChaseId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor/chaseId"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'chaseEditor',
          params: {
            chaseId: testChaseId
          }
        })
      })

      afterAll(() => {
        $router.push.mockClear()
      })
    })

    describe('when "ChaseEditor" emits "editClue" with "clueId" param', () => {
      beforeAll(async () => {
        wrapper.vm.$set($route, 'params', {
          chaseId: testChaseId
        })
        await wrapper.vm.$nextTick()
        const chaseEditor = wrapper.find('.ChaseEditor_test')
        chaseEditor.vm.$emit('editClue', testClueId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor/chaseId/clueId"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'clueEditor',
          params: {
            chaseId: testChaseId,
            clueId: testClueId
          }
        })
      })

      afterAll(() => {
        $router.push.mockClear()
      })
    })
  })
})
