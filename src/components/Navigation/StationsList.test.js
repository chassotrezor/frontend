import { mountQuasar } from '@test'
import StationsList from './StationsList'

const defaultAccessibleStations = {
  testTrailId1: {
    stations: {
      testStationId11: {
        name: 'test station name 11'
      },
      testStationId12: {
        name: 'test station name 12'
      }
    },
    data: {
      name: 'test trail name 1'
    }
  },
  testTrailId2: {
    stations: {
      testStationId21: {
        name: 'test station name 21'
      }
    },
    data: {
      name: 'test trail name 2'
    }
  }
}

const defaultLastTrail = 'testTrailId1'

const store = {
  modules: {
    user: {
      namespaced: true,
      getters: {
        accessibleStations: state => state.accessibleStations,
        lastTrail: state => state.lastTrail
      },
      mutations: {
        setAccessibleStations: (state, value) => { state.accessibleStations = value },
        setLastTrail: (state, value) => { state.lastTrail = value }
      },
      state: () => {
        return {
          accessibleStations: defaultAccessibleStations,
          lastTrail: undefined
        }
      }
    }
  }
}

const $router = {
  push: jest.fn()
}

describe('StationsList', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(StationsList, {
      store,
      mocks: {
        $router
      }
    })
    wrapper.vm.$store.commit('user/setLastTrail', defaultLastTrail)
    await wrapper.vm.$nextTick()
  })

  it('sets value of "selectedTrail" to { value: lastTrailId, label: lastTrailName }', () => {
    const trailName = defaultAccessibleStations[defaultLastTrail].data.name
    expect(wrapper.vm.selectedTrail).toEqual({
      value: defaultLastTrail,
      label: trailName
    })
  })

  describe('when "selectedTrail" and "accessibleStations" match', () => {
    it('displays a "QSelect" component with options [{ value: trailId, label: trailName }]', () => {
      const select = wrapper.find('.QSelect_test')
      expect(select.props().options).toEqual([
        { value: 'testTrailId1', label: 'test trail name 1' },
        { value: 'testTrailId2', label: 'test trail name 2' }
      ])
    })

    it('displays a "QItem" component for each station in accessibleStations[trailId].stations', () => {
      const qItems = wrapper.findAll('.QItem_test')
      const expectedLength = Object.keys(defaultAccessibleStations[defaultLastTrail].stations).length
      expect(qItems.length).toBe(expectedLength)
    })

    describe('when "QItem" emits "click" event', () => {
      beforeAll(done => {
        const qItem = wrapper.find('.testStationId11_test')
        qItem.vm.$emit('click')
        wrapper.vm.$nextTick(done)
      })

      test('router pushes to /trail/[trailId]/station/[stationId]', () => {
        const expectedRoute = {
          name: 'station',
          params: {
            trailId: 'testTrailId1',
            stationId: 'testStationId11'
          }
        }
        expect($router.push).toHaveBeenCalledWith(expectedRoute)
      })
    })
  })

  describe('when "selectedTrail" does not match "accessibleStations', () => {
    beforeAll(done => {
      wrapper.vm.selectedTrail = 'NO_MATCH'
      wrapper.vm.$nextTick(done)
    })

    it('displays a "QSelect" component with options [{ value: trailId, label: trailName }]', () => {
      const select = wrapper.find('.QSelect_test')
      expect(select.props().options).toEqual([
        { value: 'testTrailId1', label: 'test trail name 1' },
        { value: 'testTrailId2', label: 'test trail name 2' }
      ])
    })

    it('displays no "QItem" component', () => {
      const qItems = wrapper.findAll('.QItem_test')
      expect(qItems.length).toBe(0)
    })
  })

  describe('when "accessibleStations" is empty or undefined', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setAccessibleStations', undefined)
      wrapper.vm.$nextTick(done)
    })

    it('displays no "QSelect" component', () => {
      const select = wrapper.find('.QSelect_test')
      expect(select.exists()).toBe(false)
    })

    it('displays no "QItem" component', () => {
      const item = wrapper.find('.QItem_test')
      expect(item.exists()).toBe(false)
    })

    it('displays "no station yet"', () => {
      expect(wrapper.text().includes('no station yet')).toBe(true)
    })
  })
})
