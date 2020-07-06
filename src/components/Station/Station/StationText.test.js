import { mountQuasar } from '@test'
import StationText from './StationText'

const $sanitize = rawHtml => '<div>sanitized</div>'
const wrapper = mountQuasar(StationText, {
  propsData: {
    rawHtml: '<div>unsanitized</div>'
  },
  mocks: {
    $sanitize
  }
})

describe('StationText', () => {
  it('displays the sanitized html text', () => {
    expect(wrapper.text()).toBe('sanitized')
  })
})
