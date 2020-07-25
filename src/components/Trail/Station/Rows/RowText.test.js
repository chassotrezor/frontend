import { mountQuasar } from '@test'
import RowText from './RowText'

const $sanitize = rawHtml => '<div>sanitized</div>'

const row = {
  rowId: 'rowId',
  data: { rawHtml: '<div>unsanitized</div>' }
}

const wrapper = mountQuasar(RowText, {
  propsData: {
    row
  },
  mocks: {
    $sanitize
  }
})

describe('RowText', () => {
  it('displays the sanitized html text', () => {
    expect(wrapper.text()).toBe('sanitized')
  })
})
