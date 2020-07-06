import { mountQuasar } from '@test'
import TrailEditor from './TrailEditor'

const trailId = 'testTrailId'

const trail = {
  trailScheme: {
    testClueId1: {
      id: 'testClueId1',
      name: 'testClueName1'
    },
    testClueId2: {
      id: 'testClueId2',
      name: 'testClueName2'
    }
  },
  name: 'testTrailName'
}

const $route = {
  params: {}
}

const $router = {
  push: route => {
    $route.params = { ...route.params }
  }
}

const newClueId = 'newClueId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail,
        getClue: state => () => state.clueId
      },
      actions: {
        updateTrail: jest.fn(),
        createClue: jest.fn().mockResolvedValue(newClueId),
        bindClues: jest.fn(),
        unbindClues: jest.fn()
      },
      mutations: {
        setTrail: (state, trailId) => {
          state.trailId = trailId
        },
        setClue: (state, clueId) => {
          state.clueId = clueId
        }
      },
      state: () => {
        return {
          trailId: undefined,
          clueId: undefined
        }
      }
    }
  }
}

describe('TrailEditor', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(TrailEditor, {
      store,
      propsData: {
        trailId
      },
      mocks: {
        $route,
        $router
      }
    })
    wrapper.vm.$nextTick(done)
  })

  it('displays an "update" button', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "update" button emits "click"', () => {
    beforeAll(done => {
      wrapper.vm.name = 'newName'
      const btn = wrapper.find('.UpdateBtn_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('updates the name of this trail on server', () => {
      expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          newProps: {
            name: 'newName'
          }
        }
      )
    })
  })

  it('displays a "ClueCard" component for each clue in trail', () => {
    const clues = wrapper.findAll('.ClueCard_test')
    expect(clues.length).toBe(Object.keys(trail.trailScheme).length)
  })

  it('displays no "ClueEditor" component', () => {
    const clueEditor = wrapper.find('.ClueEditor_test')
    expect(clueEditor.exists()).toBe(false)
  })

  describe('when one "ClueCard" component emits "edit" with value "clueId"', () => {
    let clueId
    beforeAll(done => {
      const clue = wrapper.find('.ClueCard_test')
      clueId = clue.props().clue.id
      clue.vm.$emit('edit', clueId)
      wrapper.vm.$nextTick(done)
    })

    it('emits "editClue" event with value "clueId"', () => {
      expect(wrapper.emitted('editClue')[0][0]).toBe(clueId)
    })
  })

  it('displays a "create clue" button', () => {
    const btn = wrapper.find('.CreateClue_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "create clue" button emits "click"', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.CreateClue_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('creates a new clue for this trail on server', () => {
      expect(store.modules.editor.actions.createClue).toHaveBeenCalledWith(
        expect.any(Object),
        { trailId }
      )
    })

    it('emits "editClue" with "newClueId" value', () => {
      expect(wrapper.emitted('editClue')[1][0]).toBe(newClueId)
    })
  })
})
