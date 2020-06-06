import { mountQuasar } from '@test'
import Sign from './Sign'

describe('Sign', () => {
  const wrapper = mountQuasar(Sign)

  // TODO: find how to mock firebase.auth
  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
