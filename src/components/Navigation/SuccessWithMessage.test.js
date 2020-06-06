import { mountQuasar } from '@test'
import SuccessWithMessage from './SuccessWithMessage'

describe('SuccessWithMessage', () => {
  const wrapper = mountQuasar(SuccessWithMessage, {
    propsData: {
      message: 'testMessage'
    }
  })

  it('displays a check icon', () => {
    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props().name).toBe('check')
  })

  it('displays the message prop', () => {
    expect(wrapper.find('testMessage')).toBeTruthy()
  })
})
