import { mountQuasar } from '@test'
import StartTrail from './StartTrail'

describe('StartTrail', () => {
  const wrapper = mountQuasar(StartTrail)

  describe('when clicking on "start trail" button', () => {
    beforeAll(async () => {
      const button = wrapper.findComponent({ name: 'QBtn' })
      button.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('emits "start"', () => {
      expect(wrapper.emitted('start')).toBeTruthy()
    })
  })
})
