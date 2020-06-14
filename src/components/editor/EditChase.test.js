import { mountQuasar } from '@test'
import EditChase from './EditChase'

describe('EditChase', () => {
  const wrapper = mountQuasar(EditChase)

  it('emits "open" event with "chaseId" value when clicked', () => {
    wrapper.trigger('click') // if event click is not native but emmited by component, use component.vm.$emit('click')
    expect(wrapper.emitted('open')).toBeTruthy()
  })
})
