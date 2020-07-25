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

let okFn
const $q = {
  dialog: jest.fn().mockImplementation(() => {
    return {
      onOk: fn => { okFn = fn }
    }
  })
}

describe('TrailCard', () => {
  const wrapper = mountQuasar(TrailCard, {
    store,
    propsData: {
      trailId: 'testTrailId'
    },
    mocks: {
      $q
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(async () => {
      const clickToOpen = wrapper.find('.ClickToOpen_test')
      clickToOpen.trigger('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "edit" event with "trailId" value', () => {
      expect(wrapper.emitted('edit')).toBeTruthy()
    })
  })

  describe('when clicked on "delete" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.DeleteBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('asks user to confirm remove trail', () => {
      expect($q.dialog).toHaveBeenCalled()
    })

    describe('when user confirms removal', () => {
      beforeAll(async () => {
        okFn()
        await wrapper.vm.$nextTick()
      })

      it('deletes trail on server', () => {
        expect(store.modules.editor.actions.deleteTrail).toHaveBeenCalled()
      })
    })
  })
})
