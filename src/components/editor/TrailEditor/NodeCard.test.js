import { mountQuasar } from '@test'
import NodeCard from './NodeCard'
import types from 'src/types'

const testNodeName = 'testNodeName'

describe('NodeCard', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(NodeCard, {
      propsData: {
        node: {
          name: testNodeName,
          type: types.nodes.STATION
        }
      }
    })
    await wrapper.vm.$nextTick()
  })

  describe('when clicked on "edit" button', () => {
    beforeAll(async () => {
      const edit = wrapper.find('.EditBtn_test')
      edit.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "editStation" event', () => {
      expect(wrapper.emitted('editStation')).toBeTruthy()
    })
  })

  describe('when clicked on "remove" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.Remove_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "removeStation" event', () => {
      expect(wrapper.emitted('removeStation')).toBeTruthy()
    })
  })

  describe('when enterning new name', () => {
    const newName = 'newName'
    beforeAll(async () => {
      const input = wrapper.find('.NameInput_test')
      input.vm.$emit('input', newName)
      await wrapper.vm.$nextTick()
    })

    it('emits "inputName" with value "newName"', () => {
      expect(wrapper.emitted('inputName')[0]).toContain(newName)
    })
  })

  describe('"move before" btn', () => {
    let btn
    describe('when clicked on "move before" button', () => {
      beforeAll(async () => {
        btn = wrapper.find('.MoveBefore_test')
        btn.vm.$emit('click')
        await wrapper.vm.$nextTick()
      })

      it('emits "move:before" event', () => {
        expect(wrapper.emitted('move:before')).toBeTruthy()
      })
    })

    describe('when "first" prop is true', () => {
      beforeAll(async () => {
        wrapper.setProps({
          first: true
        })
        await wrapper.vm.$nextTick()
      })

      test('"move before" btn is disabled', () => {
        expect(btn.attributes().disable).toBeTruthy()
      })

      afterAll(async () => {
        wrapper.setProps({
          first: false
        })
        await wrapper.vm.$nextTick()
      })
    })
  })

  describe('"move after" button', () => {
    let btn
    describe('when clicked on "move after" button', () => {
      beforeAll(async () => {
        btn = wrapper.find('.MoveAfter_test')
        btn.vm.$emit('click')
        await wrapper.vm.$nextTick()
      })

      it('emits "move:after" event', () => {
        expect(wrapper.emitted('move:after')).toBeTruthy()
      })
    })

    describe('when "last" prop is true', () => {
      beforeAll(async () => {
        wrapper.setProps({
          last: true
        })
        await wrapper.vm.$nextTick()
      })

      test('"move after" btn is disabled', () => {
        expect(btn.attributes().disable).toBeTruthy()
      })

      afterAll(async () => {
        wrapper.setProps({
          last: false
        })
        await wrapper.vm.$nextTick()
      })
    })
  })

  describe('when clicked on "add before" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.AddBefore_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "newStation:before" event', () => {
      expect(wrapper.emitted('newStation:before')).toBeTruthy()
    })
  })

  describe('when clicked on "add after" button', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.AddAfter_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "newStation:after" event', () => {
      expect(wrapper.emitted('newStation:after')).toBeTruthy()
    })
  })
})
