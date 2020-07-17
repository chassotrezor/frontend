import { mountQuasar } from '@test'
import StationPreview from './StationPreview'

const trailName = 'trailName'
const stationName = 'stationName'
const rows = []

describe('StationPreview', () => {
  it('displays a "StationRenderer"', () => {
    const wrapper = mountQuasar(StationPreview,
      {
        propsData: {
          trailName,
          stationName,
          rows
        }
      })
    const renderer = wrapper.find('.StationRenderer_test')
    expect(renderer.exists()).toBe(true)
  })
})
