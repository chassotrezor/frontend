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

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getChase: () => () => chase
      },
      actions: {
        updateChase: jest.fn()
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
})
