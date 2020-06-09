import { mountQuasar } from '@test'
import { signOut } from '@firebaseAuth'

import Logout from './Logout'

describe('Logout', () => {
  mountQuasar(Logout)

  it('signs out from backend when mounted', () => {
    expect(signOut).toHaveBeenCalled()
  })
})
