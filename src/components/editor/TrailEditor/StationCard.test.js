import { mountQuasar } from '@test'
import StationCard from './StationCard'

const testStationId = 'testStationId'
const testTrailId = 'testTrailId'

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        deleteStationInTrail: jest.fn()
      }
    }
  }
}

describe('StationCard', () => {
  const wrapper = mountQuasar(StationCard, {
    store,
    propsData: {
      station: {
        id: testStationId
      },
      trailId: testTrailId
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(() => {
      const clickToEdit = wrapper.find('.ClickToEdit_test')
      clickToEdit.trigger('click')
    })

    it('emits "edit" event with value "stationId"', () => {
      expect(wrapper.emitted('edit')[0][0]).toBe(testStationId)
    })
  })

  describe('when clicked on "delete" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.DeleteBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('deletes station on server', () => {
      expect(store.modules.editor.actions.deleteStationInTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId: testTrailId,
          stationId: testStationId
        }
      )
    })
  })
})
