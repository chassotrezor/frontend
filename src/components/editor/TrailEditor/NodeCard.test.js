import { mountQuasar } from '@test'
import NodeCard from './NodeCard'
import types from 'src/types'

const testNodeName = 'testNodeName'

describe('NodeCard', () => {
  const wrapper = mountQuasar(NodeCard, {
    propsData: {
      node: {
        name: testNodeName,
        type: types.nodes.STATION
      }
    }
  })

  describe('when clicked on main area', () => {
    beforeAll(() => {
      const clickToEdit = wrapper.find('.ClickToEdit_test')
      clickToEdit.trigger('click')
    })

    it('emits "editStation" event', () => {
      expect(wrapper.emitted('editStation')).toBeTruthy()
    })
  })

  describe('when clicked on "delete" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.DeleteBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "remove" event', () => {
      expect(wrapper.emitted('remove')).toBeTruthy()
    })
  })
})
