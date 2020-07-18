import { mountQuasar } from '@test'
import StationRow from './StationRow'
import types from 'src/types'

describe('StationRow', () => {
  const wrapper = mountQuasar(StationRow, {
    propsData: {
      row: {}
    }
  })

  describe('remove button', () => {
    it('emits "remove" when remove button emits "click"', async () => {
      const rm = wrapper.find('.RemoveBtn_test')
      rm.vm.$emit('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().remove).toBeTruthy()
    })
  })

  describe('up button', () => {
    const up = wrapper.find('.UpBtn_test')
    it('emits "up" when up button emits "click"', async () => {
      up.vm.$emit('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().up).toBeTruthy()
    })

    it('is disabled when "first" prop is true', async () => {
      wrapper.setProps({
        first: true
      })
      await wrapper.vm.$nextTick()
      expect(up.props().disable).toBe(true)
    })
  })

  describe('down button', () => {
    const down = wrapper.find('.DownBtn_test')
    it('emits "down" when down button emits "click"', async () => {
      down.vm.$emit('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().down).toBeTruthy()
    })

    it('is disabled when "last" prop is true', async () => {
      wrapper.setProps({
        last: true
      })
      await wrapper.vm.$nextTick()
      expect(down.props().disable).toBe(true)
    })
  })

  describe('row', () => {
    it('displays a textRow if prop "row.type" is "TEXT"', async () => {
      wrapper.setProps({
        row: {
          type: types.rows.TEXT
        }
      })
      await wrapper.vm.$nextTick()
      const textRow = wrapper.find('.TextRow_test')
      expect(textRow.exists()).toBe(true)
    })

    it('displays a imageRow if prop "row.type" is "IMAGE"', async () => {
      wrapper.setProps({
        row: {
          type: types.rows.IMAGE
        }
      })
      await wrapper.vm.$nextTick()
      const imageRow = wrapper.find('.ImageRow_test')
      expect(imageRow.exists()).toBe(true)
    })
  })
})
