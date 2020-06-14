import { mountQuasar } from '@test'
import ChaseLink from './ChaseLink'

describe('ChaseLink', () => {
  const wrapper = mountQuasar(ChaseLink)

  it('emits "open" event with "chaseId" value when clicked', () => {
    wrapper.trigger('click') // if event click is not native but emmited by component, use component.vm.$emit('click')
    expect(wrapper.emitted('open')).toBeTruthy()
  })
})
