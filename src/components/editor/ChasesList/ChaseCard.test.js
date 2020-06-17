import { mountQuasar } from '@test'
import ChaseCard from './ChaseCard'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        deleteChase: jest.fn()
      },
      getters: {
        getChase: () => () => {
          return {
            name: 'testChaseName',
            id: 'testChaseId'
          }
        }
      }
    }
  }
}

describe('ChaseCard', () => {
  const wrapper = mountQuasar(ChaseCard, {
    store,
    propsData: {
      chaseId: 'testChaseId'
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(done => {
      const clickToOpen = wrapper.find('.ClickToOpen_test')
      clickToOpen.trigger('click')
      wrapper.vm.$nextTick(done)
    })

    it('emits "edit" event with "chaseId" value', () => {
      expect(wrapper.emitted('edit')).toBeTruthy()
    })
  })

  describe('when clicked on "delete" button', () => {
    beforeAll(done => {
      const btn = wrapper.find('.DeleteBtn_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('deletes chase on server', () => {
      expect(store.modules.editor.actions.deleteChase).toHaveBeenCalled()
    })
  })
})