import { mountQuasar } from '@test'
import EditClue from './EditClue'

describe('EditClue', () => {
  const wrapper = mountQuasar(EditClue, {
    propsData: {
      clue: {}
    }
  })

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
