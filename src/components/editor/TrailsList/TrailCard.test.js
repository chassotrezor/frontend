import { mountQuasar } from '@test'
import TrailCard from './TrailCard'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        deleteTrail: jest.fn()
      },
      getters: {
        getTrail: () => () => {
          return {
            name: 'testTrailName',
            id: 'testTrailId'
          }
        }
      }
    }
  }
}

describe('TrailCard', () => {
  const wrapper = mountQuasar(TrailCard, {
    store,
    propsData: {
      trailId: 'testTrailId'
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(done => {
      const clickToOpen = wrapper.find('.ClickToOpen_test')
      clickToOpen.trigger('click')
      wrapper.vm.$nextTick(done)
    })

    it('emits "edit" event with "trailId" value', () => {
      expect(wrapper.emitted('edit')).toBeTruthy()
    })
  })

  describe('when clicked on "delete" button', () => {
    beforeAll(done => {
      const btn = wrapper.find('.DeleteBtn_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('deletes trail on server', () => {
      expect(store.modules.editor.actions.deleteTrail).toHaveBeenCalled()
    })
  })
})
