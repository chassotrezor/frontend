import { mountQuasar } from '@test'
import Station from './Station'

const trailId = 'testTrailId'
const stationId = 'testStationId'

const station = {
  title: 'Test Station Title',
  isTrailEntry: false,
  rows: [
    {
      type: 'text',
      rawHtml: 'testText'
    },
    {
      type: 'image',
      url: 'testSrc'
    }
  ]
}

function nbRowsOfType (type) {
  const filteredRows = station.rows.filter(row => row.type === type)
  return filteredRows.length
}

const $route = {
  params: {
    trailId,
    stationId
  }
}

const store = {
  modules: {
    user: {
      namespaced: true,
      actions: {
        saveStationAccess: jest.fn()
      }
    },
    trails: {
      namespaced: true,
      getters: {
        getStation: () => jest.fn(() => station)
      }
    }
  }
}
const wrapper = mountQuasar(Station, {
  store,
  mocks: {
    $route
  }
})

describe('Station', () => {
  it('saves access for this station for this user on the server', () => {
    expect(store.modules.user.actions.saveStationAccess).toHaveBeenCalled()
  })

  it('displays as many "StationImage" components as rows with type "image" in station', () => {
    const stationTexts = wrapper.findAll('.StationImage_test')
    expect(stationTexts.length).toBe(nbRowsOfType('image'))
  })

  it('displays as many "StationText" components as rows with type "text" in station', () => {
    const stationTexts = wrapper.findAll('.StationText_test')
    expect(stationTexts.length).toBe(nbRowsOfType('text'))
  })
})
