import { mountQuasar } from '@test'
import TrailInfo from './TrailInfo'

describe('TrailInfo', () => {
  const wrapper = mountQuasar(TrailInfo)
  it('exists', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
