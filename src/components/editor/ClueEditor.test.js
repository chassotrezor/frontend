import { mountQuasar } from '@test'
import ClueEditor from './ClueEditor'

describe('ClueEditor', () => {
  const wrapper = mountQuasar(ClueEditor, {
    propsData: {
      clueId: 'testClueId'
    }
  })

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
