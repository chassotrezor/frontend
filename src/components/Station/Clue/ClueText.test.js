import { mountQuasar } from '@test'
import ClueText from './ClueText'

const $sanitize = rawHtml => '<div>sanitized</div>'
const wrapper = mountQuasar(ClueText, {
  propsData: {
    rawHtml: '<div>unsanitized</div>'
  },
  mocks: {
    $sanitize
  }
})

describe('ClueText', () => {
  it('displays the sanitized html text', () => {
    expect(wrapper.text()).toBe('sanitized')
  })
})
