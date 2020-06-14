import { mountQuasar } from '@test'
import EditChase from './EditChase'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        deleteChase: jest.fn()
      }
    }
  }
}

describe('EditChase', () => {
  const wrapper = mountQuasar(EditChase, {
    store,
    propsData: {
      chase: {
        name: 'testChaseName',
        id: 'testChaseId'
      }
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(done => {
      const clickToOpen = wrapper.find('.ClickToOpen_test')
      clickToOpen.trigger('click')
      wrapper.vm.$nextTick(done)
    })

    it('emits "open" event with "chaseId" value', () => {
      expect(wrapper.emitted('open')).toBeTruthy()
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
