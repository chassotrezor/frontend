import { mountQuasar } from '@test'
import TrailInfo from './TrailInfo'
import { renderDuration } from 'src/helpers/dataHelpers'

const trail = {
  name: 'testTrail',
  description: '<div>Description</div>',
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

const $sanitize = rawHtml => `sanitized ${rawHtml}`

describe('TrailInfo', () => {
  const wrapper = mountQuasar(TrailInfo, {
    store,
    mocks: {
      $route,
      $sanitize
    }
  })

  it('displays trail name', () => {
    expect(wrapper.html()).toContain(trail.name)
  })

  it('displays a sanitized trail description', () => {
    const description = wrapper.find('.TrailDescription_test')
    expect(description.html()).toContain($sanitize(trail.description))
  })

  it('displays a trail duration', () => {
    const duration = wrapper.find('.TrailDuration_test')
    expect(duration.html()).toContain(renderDuration(trail.durationMinutes))
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
