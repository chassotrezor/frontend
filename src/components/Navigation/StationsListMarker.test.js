import { mountQuasar } from '@test'
import StationsListMarker from './StationsListMarker'
import { latLng } from 'leaflet'

const station = {
  trailId: 'testTrailId',
  trailName: 'testTrailName',
  stationId: 'testStationId',
  stationName: 'testStationName',
  latLng: latLng(0, 0),
  color: '#000000'
}

const $router = {
  push: jest.fn()
}

describe('StationsListMarker', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(StationsListMarker, {
      propsData: { station },
      mocks: {
        $router
      }
    })
    await wrapper.vm.$nextTick()
  })

  it('has a "LTooltip" displaying station name and trail name', () => {
    const tooltip = wrapper.find('.LTooltip_test')
    expect(tooltip.html().includes(station.trailName)).toBe(true)
    expect(tooltip.html().includes(station.stationName)).toBe(true)
  })

  describe('when "LMarker" emits "click"', () => {
    beforeAll(async () => {
      const marker = wrapper.find('.LMarker_test')
      marker.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    test('router pushes to /trail/[trailId]/station/[stationId]', () => {
      const expectedRoute = {
        name: 'station',
        params: {
          trailId: 'testTrailId',
          stationId: 'testStationId'
        }
      }
      expect($router.push).toHaveBeenCalledWith(expectedRoute)
    })
  })
})
