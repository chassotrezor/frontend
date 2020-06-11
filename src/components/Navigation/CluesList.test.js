import { mountQuasar } from '@test'
import CluesList from './CluesList'

describe('CluesList', () => {
  const wrapper = mountQuasar(CluesList)

  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
