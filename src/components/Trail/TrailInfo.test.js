import { mountQuasar } from '@test'
import TrailInfo from './TrailInfo'

const trail = {
  name: 'testTrail',
  durationMinutes: 90,
  physicalEffort: 2,
  mentalEffort: 3
}

const store = {
  modules: {
    trails: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail
      }
    }
  }
}

const $route = {
  params: {
    trailId: 'testTrailId'
  }
}

describe('TrailInfo', () => {
  const wrapper = mountQuasar(TrailInfo, {
    store,
    mocks: { $route }
  })

  it('displays trail name', () => {
    expect(wrapper.html()).toContain(trail.name)
  })

  it('displays a readonly "q-rating" with "physicalEffort"', () => {
    const rating = wrapper.find('.PhysicalRating_test')
    expect(rating.props().value).toBe(trail.physicalEffort)
    expect(rating.props().readonly).toBe(true)
  })

  it('displays a readonly "q-rating" with "mentalEffort"', () => {
    const rating = wrapper.find('.MentalRating_test')
    expect(rating.props().value).toBe(trail.mentalEffort)
    expect(rating.props().readonly).toBe(true)
  })
})
