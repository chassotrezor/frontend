import { mountQuasar } from '@test'
import TrailMarker from './TrailMarker'
import { fromArray } from 'src/helpers/mapHelpers'

const name = 'trailName'
const latLng = fromArray([0, 0]).toLatLng()

describe('TrailMarker', () => {
  const wrapper = mountQuasar(TrailMarker, {
    propsData: {
      name,
      latLng
    }
  })

  it('contains a "LMarker"', () => {
    const lMarker = wrapper.find('.LMarker_test')
    expect(lMarker.exists()).toBe(true)
  })

  it('displays the trail name', () => {
    expect(wrapper.html()).toContain(name)
  })
})
