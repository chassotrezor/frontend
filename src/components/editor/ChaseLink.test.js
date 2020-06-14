import { mountQuasar } from '@test'
import ChaseLink from './ChaseLink'

describe('ChaseLink', () => {
  const wrapper = mountQuasar(ChaseLink)

  it('exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
