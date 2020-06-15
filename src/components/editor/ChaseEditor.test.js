import { mountQuasar } from '@test'
import ChaseEditor from './ChaseEditor'

const chaseId = 'testChaseId'

const chase = {
  chaseScheme: {
    testClueId1: {
      id: 'testClueId1',
      name: 'testClueName1'
    },
    testClueId2: {
      id: 'testClueId2',
      name: 'testClueName2'
    }
  },
  name: 'testChaseName'
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
        getChase: () => () => chase,
        getClue: state => () => state.clueId
      },
      actions: {
        updateChase: jest.fn(),
        createClue: jest.fn().mockResolvedValue(newClueId),
        bindClues: jest.fn(),
        unbindClues: jest.fn()
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

describe('ChaseEditor', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(ChaseEditor, {
      store,
      propsData: {
        chaseId
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

    it('updates the name of this chase on server', () => {
      expect(store.modules.editor.actions.updateChase).toHaveBeenCalledWith(
        expect.any(Object),
        {
          chaseId,
          newProps: {
            name: 'newName'
          }
        }
      )
    })
  })

  it('displays an "EditClue" component for each clue in chase', () => {
    const clues = wrapper.findAll('.EditClue_test')
    expect(clues.length).toBe(Object.keys(chase.chaseScheme).length)
  })

  it('displays no "ClueEditor" component', () => {
    const clueEditor = wrapper.find('.ClueEditor_test')
    expect(clueEditor.exists()).toBe(false)
  })

  describe('when one "EditClue" component emits "edit" with value "clueId"', () => {
    let clueId
    beforeAll(done => {
      const clue = wrapper.find('.EditClue_test')
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

    it('creates a new clue for this chase on server', () => {
      expect(store.modules.editor.actions.createClue).toHaveBeenCalledWith(
        expect.any(Object),
        { chaseId }
      )
    })

    it('emits "editClue" with "newClueId" value', () => {
      expect(wrapper.emitted('editClue')[1][0]).toBe(newClueId)
    })
  })

  // describe('when "ChaseEditor" emits "editClue" with value "clueId"', () => {
  //   beforeAll(async () => {
  //     const chaseEditor = wrapper.find('.ChaseEditor_test')
  //     chaseEditor.vm.$emit('editClue', testClueId)
  //     await wrapper.vm.$nextTick()
  //     wrapper.vm.$store.commit('editor/setClue', $route.params.clueId)
  //     await wrapper.vm.$nextTick()
  //   })

  //   it('displays no "MyChases" component', () => {
  //     const myChases = wrapper.find('.MyChases_test')
  //     expect(myChases.exists()).toBe(false)
  //   })

  //   it('displays no "ChaseEditor" component', () => {
  //     const chaseEditor = wrapper.find('.ChaseEditor_test')
  //     expect(chaseEditor.exists()).toBe(false)
  //   })

  //   it('displays a "ClueEditor" component', () => {
  //     const clueEditor = wrapper.find('.ClueEditor_test')
  //     expect(clueEditor.exists()).toBe(true)
  //   })
  // })
})
