import { mountQuasar } from '@test'
import StationText from './StationText'

const $sanitize = rawHtml => '<div>sanitized</div>'

const row = {
  rowId: 'rowId',
  data: { rawHtml: '<div>unsanitized</div>' }
}

const wrapper = mountQuasar(StationText, {
  propsData: {
    row
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
