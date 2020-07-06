import { mountQuasar } from '@test'
import ClueCard from './ClueCard'

const testClueId = 'testClueId'
const testTrailId = 'testTrailId'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        deleteClueInTrail: jest.fn()
      }
    }
  }
}

describe('ClueCard', () => {
  const wrapper = mountQuasar(ClueCard, {
    store,
    propsData: {
      clue: {
        id: testClueId
      },
      trailId: testTrailId
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(() => {
      const clickToEdit = wrapper.find('.ClickToEdit_test')
      clickToEdit.trigger('click')
    })

    it('emits "edit" event with value "clueId"', () => {
      expect(wrapper.emitted('edit')[0][0]).toBe(testClueId)
    })
  })

  describe('when clicked on "delete" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.DeleteBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('deletes clue on server', () => {
      expect(store.modules.editor.actions.deleteClueInTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId: testTrailId,
          clueId: testClueId
        }
      )
    })
  })
})
