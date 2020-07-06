import { mountQuasar } from '@test'
import Editor from './Editor'

const testTrailId = 'testTrailId'
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
      path: '/editor/:trailId',
      name: 'trailEditor',
      children: [{
        path: '/editor/:trailId/:clueId',
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
        bindMyTrails: jest.fn(),
        unbindMyTrails: jest.fn(),
        bindClues: jest.fn(),
        unbindClues: jest.fn()
      },
      getters: {
        getTrail: () => () => testTrailId,
        getClue: () => () => testClueId
      }
      //   getTrail: state => () => state.trailId,
      //   getClue: state => () => state.clueId
      // },
      // mutations: {
      //   setTrail: (state, trailId) => {
      //     state.trailId = trailId
      //   },
      //   setClue: (state, clueId) => {
      //     state.clueId = clueId
      //   }
      // },
      // state: () => {
      //   return {
      //     trailId: undefined,
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

      it('displays a "TrailsList" component', () => {
        const myTrails = wrapper.find('.TrailsList_test')
        expect(myTrails.exists()).toBe(true)
      })

      it('displays no "TrailEditor" component', () => {
        const trailEditor = wrapper.find('.TrailEditor_test')
        expect(trailEditor.exists()).toBe(false)
      })

      it('displays no "ClueEditor" component', () => {
        const clueEditor = wrapper.find('.ClueEditor_test')
        expect(clueEditor.exists()).toBe(false)
      })
    })

    describe('when "route.params.trailId" exists and "route.params.clueId" does not', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'trailEditor',
          params: {
            trailId: testTrailId
          }
        })
        await wrapper.vm.$nextTick()
      })

      it('displays no "TrailsList" component', () => {
        const myTrails = wrapper.find('.TrailsList_test')
        expect(myTrails.exists()).toBe(false)
      })

      it('displays a "TrailEditor" component with "trail-id" prop set to "trailId"', () => {
        const trailEditor = wrapper.find('.TrailEditor_test')
        expect(trailEditor.props().trailId).toBe(testTrailId)
      })

      it('displays no "ClueEditor" component', () => {
        const clueEditor = wrapper.find('.ClueEditor_test')
        expect(clueEditor.exists()).toBe(false)
      })
    })

    describe('when "route.params.trailId" and "route.params.clueId" exist', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'clueEditor',
          params: {
            trailId: testTrailId,
            clueId: testClueId
          }
        })
        await wrapper.vm.$nextTick()
      })

      it('displays no "TrailsList" component', () => {
        const myTrails = wrapper.find('.TrailsList_test')
        expect(myTrails.exists()).toBe(false)
      })

      it('displays no "TrailEditor" component', () => {
        const trailEditor = wrapper.find('.TrailEditor_test')
        expect(trailEditor.exists()).toBe(false)
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
      it('starts listening to MyTrails on server', () => {
        expect(store.modules.editor.actions.bindMyTrails).toHaveBeenCalled()
      })
    })

    describe('when "$route.params.trailId" becomes defined', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'trailEditor',
          params: {
            trailId: testTrailId
          }
        })
        await wrapper.vm.$nextTick()
      })

      it('starts listening to changes of clues in trail', () => {
        expect(store.modules.editor.actions.bindClues).toHaveBeenCalledWith(
          expect.any(Object),
          { trailId: testTrailId }
        )
      })
    })

    describe('when "$route.params.trailId" becomes undefined', () => {
      beforeAll(async () => {
        wrapper.vm.$router.push({
          name: 'editor'
        })
        await wrapper.vm.$nextTick()
      })

      it('stops listening to changes of clues in trail', () => {
        expect(store.modules.editor.actions.unbindClues).toHaveBeenCalledWith(
          expect.any(Object),
          { trailId: testTrailId }
        )
      })
    })

    describe('when destroyed', () => {
      beforeAll(() => {
        wrapper.destroy()
      })

      it('stops listening to MyTrails on server', () => {
        expect(store.modules.editor.actions.unbindMyTrails).toHaveBeenCalled()
      })

      it('stops listening to clues of selected Trail on server if a trail is selected', () => {
        expect(store.modules.editor.actions.unbindClues).toHaveBeenCalledWith(
          expect.any(Object),
          { trailId: testTrailId }
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
          selectedTrail: false,
          selectedClue: false
        }
      })
      await wrapper.vm.$nextTick()
    })

    describe('when "EditorFastAccess" emits "unselect" with "trailId" param', () => {
      beforeAll(async () => {
        const fastAccess = wrapper.find('.EditorFastAccess_test')
        fastAccess.vm.$emit('unselect', testTrailId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'editor',
          params: {}
        })
      })

      afterAll(async () => {
        wrapper.vm.$set($route, 'params', {})
        $router.push.mockClear()
      })
    })

    describe('when "EditorFastAccess" emits "editTrail" with "trailId" param', () => {
      beforeAll(async () => {
        const fastAccess = wrapper.find('.EditorFastAccess_test')
        fastAccess.vm.$emit('editTrail', testTrailId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor/trailId"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'trailEditor',
          params: {
            trailId: testTrailId
          }
        })
      })

      afterAll(async () => {
        wrapper.vm.$set($route, 'params', {})
        $router.push.mockClear()
        await wrapper.vm.$nextTick()
      })
    })

    describe('when "EditorFastAccess" emits "editClue" with "clueId" param', () => {
      beforeAll(async () => {
        wrapper.vm.$set($route, 'params', {
          trailId: testTrailId
        })
        await wrapper.vm.$nextTick()
        const fastAccess = wrapper.find('.EditorFastAccess_test')
        fastAccess.vm.$emit('editClue', testClueId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor/trailId/trailId"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'clueEditor',
          params: {
            trailId: testTrailId,
            clueId: testClueId
          }
        })
      })

      afterAll(async () => {
        wrapper.vm.$set($route, 'params', {})
        $router.push.mockClear()
        await wrapper.vm.$nextTick()
      })
    })

    describe('when "TrailsList" emits "editTrail" with "trailId" param', () => {
      beforeAll(async () => {
        const myTrails = wrapper.find('.TrailsList_test')
        myTrails.vm.$emit('editTrail', testTrailId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor/trailId"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'trailEditor',
          params: {
            trailId: testTrailId
          }
        })
      })

      afterAll(async () => {
        wrapper.vm.$set($route, 'params', {})
        $router.push.mockClear()
        await wrapper.vm.$nextTick()
      })
    })

    describe('when "TrailEditor" emits "editClue" with "clueId" param', () => {
      beforeAll(async () => {
        wrapper.vm.$set($route, 'params', {
          trailId: testTrailId
        })
        await wrapper.vm.$nextTick()
        const trailEditor = wrapper.find('.TrailEditor_test')
        trailEditor.vm.$emit('editClue', testClueId)
        await wrapper.vm.$nextTick()
      })

      it('navigates to "/editor/trailId/clueId"', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: 'clueEditor',
          params: {
            trailId: testTrailId,
            clueId: testClueId
          }
        })
      })

      afterAll(async () => {
        wrapper.vm.$set($route, 'params', {})
        $router.push.mockClear()
        await wrapper.vm.$nextTick()
      })
    })
  })
})
