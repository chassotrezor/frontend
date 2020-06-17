import { mountQuasar } from '@test'
import ClueRow from './ClueRow'

describe('ClueRow', () => {
  const wrapper = mountQuasar(ClueRow, {
    propsData: {
      type: 'text',
      value: '<div>TEST</div>'
    }
  })

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
