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

  describe('when clicked on "up" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.UpBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "remove" event', () => {
      expect(wrapper.emitted('up')).toBeTruthy()
    })
  })

  describe('when "first" prop is true', () => {
    beforeAll(async () => {
      wrapper.setProps({
        first: true
      })
      await wrapper.vm.$nextTick()
    })

    test('"up" btn is disabled', () => {
      const btn = wrapper.find('.UpBtn_test')
      expect(btn.attributes().disable).toBeTruthy()
    })

    afterAll(async () => {
      wrapper.setProps({
        first: false
      })
      await wrapper.vm.$nextTick()
    })
  })

  describe('when clicked on "down" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.DownBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "remove" event', () => {
      expect(wrapper.emitted('down')).toBeTruthy()
    })
  })

  describe('when "last" prop is true', () => {
    beforeAll(async () => {
      wrapper.setProps({
        last: true
      })
      await wrapper.vm.$nextTick()
    })

    test('"down" btn is disabled', () => {
      const btn = wrapper.find('.DownBtn_test')
      expect(btn.attributes().disable).toBeTruthy()
    })

    afterAll(async () => {
      wrapper.setProps({
        last: false
      })
      await wrapper.vm.$nextTick()
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
