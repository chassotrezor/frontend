import { mountQuasar } from '@test'
import ClueEditor from './ClueEditor'

const clueId = 'testClueId'
const chaseId = 'testChaseId'

const testClueName = 'testClueName'
const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        updateClueInChase: jest.fn()
      },
      getters: {
        getClue: () => () => {
          return {
            name: testClueName
          }
        }
      }
    }
  }
}

describe('ClueEditor', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(ClueEditor, {
      propsData: {
        clueId,
        chaseId
      },
      store
    })
    await wrapper.vm.$nextTick()
  })

  it('initializes "name" data to "clue.name"', () => {
    expect(wrapper.vm.name).toBe(testClueName)
  })

  it('displays a "QInput" for "name"', () => {
    const qInput = wrapper.find('.QInputName_test')
    expect(qInput.props().value).toBe(testClueName)
  })

  it('displays an "update" button', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "update" button emits "click"', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.UpdateBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('updates the clue in the chase on server', () => {
      expect(store.modules.editor.actions.updateClueInChase).toHaveBeenCalledWith(
        expect.any(Object),
        {
          chaseId,
          clueId,
          newProps: {
            name: testClueName
          }
        }
      )
    })
  })
})
