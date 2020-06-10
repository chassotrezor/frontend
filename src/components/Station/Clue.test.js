import { mountQuasar } from '@test'
import Clue from './Clue'

describe('Clue', () => {
  const wrapper = mountQuasar(Clue)
  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
