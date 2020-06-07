import { mountQuasar } from '@test'
import Logout from './Logout'

describe('Logout', () => {
  const wrapper = mountQuasar(Logout)

  // TODO: find how to mock firebase.auth
  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
