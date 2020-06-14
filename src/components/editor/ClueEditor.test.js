import { mountQuasar } from '@test'
import ClueEditor from './ClueEditor'

describe('ClueEditor', () => {
  const wrapper = mountQuasar(ClueEditor)

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
