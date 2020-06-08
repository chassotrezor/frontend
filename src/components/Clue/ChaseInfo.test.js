import { mountQuasar } from '@test'
import ChaseInfo from './ChaseInfo'

describe('ChaseInfo', () => {
  const wrapper = mountQuasar(ChaseInfo)
  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
