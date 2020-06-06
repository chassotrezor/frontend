import { mountQuasar } from '@test'
import SignMethodItem from './SignMethodItem'

describe('SignMethodItem', () => {
  const name = 'testName'
  const wrapper = mountQuasar(SignMethodItem, {
    propsData: {
      name
    }
  })

  it('displays its name', () => {
    expect(wrapper.find(name)).toBeTruthy()
  })

  it('emits click event when clicked', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
