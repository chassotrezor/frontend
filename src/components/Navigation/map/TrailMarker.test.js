import { mountQuasar } from '@test'
import TrailMarker from './TrailMarker'

const trail = {
  name: 'trailName'
}

describe('TrailMarker', () => {
  const wrapper = mountQuasar(TrailMarker, {
    propsData: {
      trail
    }
  })

  it('contains a "LMarker"', () => {
    const lMarker = wrapper.find('.LMarker_test')
    expect(lMarker.exists()).toBe(true)
  })

  it('displays the trail name', () => {
    expect(wrapper.html()).toContain(trail.name)
  })
})
