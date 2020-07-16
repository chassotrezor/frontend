import { mountQuasar } from '@test'
import NodeMarker from './NodeMarker'

const node = {
  position: [0, 0]
}

describe('NodeMarker', () => {
  let wrapper
  let marker
  let nodeCard
  beforeAll(async () => {
    wrapper = mountQuasar(NodeMarker, {
      propsData: { node }
    })
    marker = wrapper.find('.LMarker_test')
    nodeCard = wrapper.find('.NodeCard_test')
    await wrapper.vm.$nextTick()
  })

  it('displays a "LMarker"', () => {
    expect(marker.exists()).toBe(true)
  })

  it('displays a "NodeCard"', () => {
    expect(nodeCard.exists()).toBe(true)
  })

  it('emits "editStation" when "NodeCard" emits "editStation"', async () => {
    nodeCard.vm.$emit('editStation')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('editStation')).toBeTruthy()
  })

  it('emits "updateName" with new name when "NodeCard" emits "inputName"', async () => {
    const newName = 'newName'
    nodeCard.vm.$emit('inputName', newName)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('updateName')[0][0]).toBe(newName)
  })

  it('emits "newStation:before" when "NodeCard" emits "newStation:before"', async () => {
    nodeCard.vm.$emit('newStation:before')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('newStation:before')).toBeTruthy()
  })

  it('emits "newStation:after" when "NodeCard" emits "newStation:after"', async () => {
    nodeCard.vm.$emit('newStation:after')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('newStation:after')).toBeTruthy()
  })

  it('emits "move:before" when "NodeCard" emits "move:before"', async () => {
    nodeCard.vm.$emit('move:before')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('move:before')).toBeTruthy()
  })

  it('emits "move:after" when "NodeCard" emits "move:after"', async () => {
    nodeCard.vm.$emit('move:after')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('move:after')).toBeTruthy()
  })

  it('emits "removeStation" with setInvisible function when "NodeCard" emits "removeStation"', async () => {
    nodeCard.vm.$emit('removeStation')
    await wrapper.vm.$nextTick()
    wrapper.emitted('removeStation')[0][0]()
    expect(wrapper.vm.visible).toBe(false)
  })
})
