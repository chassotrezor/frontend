import { mountQuasar } from '@test'
import StartTrail from './StartTrail'

describe('StartTrail', () => {
  const trailId = 'testTrailId'
  const store = {
    modules: {
      trail: {
        namespaced: true,
        actions: {
          start: jest.fn()
        },
        state: () => {}
      }
    }
  }
  const wrapper = mountQuasar(StartTrail, {
    store,
    mocks: {
      $route: {
        params: {
          trailId
        }
      }
    }
  })

  describe('when clicking on "start trail" button', () => {
    beforeAll(done => {
      const button = wrapper.findComponent({ name: 'QBtn' })
      button.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('fires "start" method with "trailId" parameter', () => {
      const start = store.modules.trail.actions.start
      expect(start).toHaveBeenCalledWith(expect.any(Object), { trailId })
    })
  })
})
