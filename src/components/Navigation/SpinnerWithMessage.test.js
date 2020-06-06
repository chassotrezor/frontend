import { mountQuasar } from '@test'
import SpinnerWithMessage from './SpinnerWithMessage'

describe('SpinnerWithMessage', () => {
  const wrapper = mountQuasar(SpinnerWithMessage, {
    propsData: {
      message: 'testMessage'
    }
  })

  it('displays a spinner', () => {
    const spinner = wrapper.findComponent({ name: 'QSpinner' })
    expect(spinner.exists()).toBeTruthy()
  })

  it('displays the message prop', () => {
    expect(wrapper.find('testMessage')).toBeTruthy()
  })
})
