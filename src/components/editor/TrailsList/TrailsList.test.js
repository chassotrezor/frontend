import { mountQuasar } from '@test'
import TrailsList from './TrailsList'
import { fromNavigatorPosition, fromArray } from 'src/helpers/mapHelpers'

jest.mock('firebase/app', () => {
  return {
    firestore: {
      GeoPoint: class {
        constructor (lat, lng) {
          this.Ac = lat
          this.Rc = lng
        }
      }
    }
  }
})

const testTrails = {
  testTrailId1: {
    id: 'testTrailId1',
    name: 'testName1'
  },
  testTrailId2: {
    id: 'testTrailId2',
    name: 'testName2'
  }
}

const newTrailId = 'newTrailId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myTrails: () => testTrails
      },
      actions: {
        createTrail: jest.fn().mockResolvedValue(newTrailId)
      }
    }
  }
}

const $geo = {
  point: (lat, lng) => {
    return { Ac: lat, Rc: lng }
  }
}

const navigatorPosition = {
  coords: {
    latitude: 30,
    longitude: 40,
    accuracy: 10
  }
}
const geolocationMocksSuccess = {
  getCurrentPosition: jest.fn((positionFct, errorFct) => { positionFct(navigatorPosition) })
}

const positionError = new Error('position error')
const geolocationMocksFailure = {
  getCurrentPosition: jest.fn((positionFct, errorFct) => { errorFct(positionError) })
}

describe('TrailsList', () => {
  let wrapper

  beforeAll(async () => {
    wrapper = mountQuasar(TrailsList, {
      store,
      mocks: { $geo }
    })
    await wrapper.vm.$nextTick()
  })

  it('displays a "TrailCard" component for each trail I created', () => {
    const myTrails = wrapper.findAll('.TrailCard_test')
    expect(myTrails.length).toBe(Object.keys(testTrails).length)
  })

  describe('when "TrailCard" component emits "edit"', () => {
    beforeAll(async () => {
      const editTrail = wrapper.find('.TrailCard_test')
      editTrail.vm.$emit('edit')
      await wrapper.vm.$nextTick()
    })

    it('emits "editTrail" event with "trailId" parameter', () => {
      expect(wrapper.emitted().editTrail[0][0]).toBe(testTrails.testTrailId1.id)
    })
  })

  it('displays a "create trail" button', () => {
    const btn = wrapper.find('.CreateTrail_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "create trail" button emits "click" and navigator grants access to position', () => {
    beforeAll(async () => {
      global.navigator.geolocation = geolocationMocksSuccess
      const btn = wrapper.find('.CreateTrail_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('creates a new trail on the server at navigator position', () => {
      expect(store.modules.editor.actions.createTrail).toHaveBeenCalledWith(
        expect.any(Object),
        { position: fromNavigatorPosition(navigatorPosition).toGeopoint() }
      )
    })

    it('emits "editTrail" event with value "newTrailId"', () => {
      expect(wrapper.emitted().editTrail[1][0]).toBe(newTrailId)
    })
  })

  describe('when navigator refuses access to position', () => {
    beforeAll(async () => {
      global.navigator.geolocation = geolocationMocksFailure
      const btn = wrapper.find('.CreateTrail_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('creates a new trail on the server at position (0, 0)', () => {
      expect(store.modules.editor.actions.createTrail).toHaveBeenCalledWith(
        expect.any(Object),
        { position: fromArray([0, 0]).toGeopoint() }
      )
    })

    it('emits "editTrail" event with value "newTrailId"', () => {
      expect(wrapper.emitted().editTrail[2][0]).toBe(newTrailId)
    })
  })
})
