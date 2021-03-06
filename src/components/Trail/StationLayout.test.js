import { mountQuasar } from '@test'
import StationLayout from './StationLayout'

const trailId = 'testTrailId'
const stationId = 'testStationId'

const $route = {
  params: {
    trailId,
    stationId
  }
}

const $router = {
  back: jest.fn()
}

const $q = {
  notify: jest.fn()
}

const testTrail = {
  graph: { trailEntries: ['testStationId'] }
}

const closedTestTrail = {
  graph: { trailEntries: [] }
}

const testStation = {
  name: 'testStationName'
}

const store = {
  modules: {
    trails: {
      namespaced: true,
      actions: {
        downloadTrail: jest.fn(),
        downloadStation: jest.fn()
      },
      getters: {
        getStation: state => () => state.station,
        getTrail: state => () => state.trail
      },
      mutations: {
        setStation: (state, station) => { state.station = station },
        setTrail: (state, trail) => { state.trail = trail }
      },
      state: () => {
        return {
          station: undefined,
          trail: undefined
        }
      }
    },
    user: {
      namespaced: true,
      getters: {
        openTrails: state => state.openTrails
      },
      mutations: {
        setOpenTrails: (state, openTrails) => { state.openTrails = openTrails }
      },
      actions: {
        updateTrailAccess: jest.fn()
      },
      state: () => {
        return {
          openTrails: []
        }
      }
    }
  }
}

describe('StationLayout', () => {
  let wrapper

  describe('when "station" exists', () => {
    beforeAll(async () => {
      wrapper = mountQuasar(StationLayout, {
        store,
        mocks: {
          $route,
          $router
        }
      })
    })

    it('displays a "SpinnerWithMessage" component', () => {
      const spinner = wrapper.find('.SpinnerWithMessage_test')
      expect(spinner.exists()).toBe(true)
    })

    describe('when "station" and "trail" datas are downloaded', () => {
      beforeAll(async () => {
        wrapper.vm.$store.commit('trails/setTrail', testTrail)
        wrapper.vm.$store.commit('trails/setStation', testStation)
        store.modules.trails.actions.downloadStation.mockResolvedValue()
        store.modules.trails.actions.downloadTrail.mockResolvedValue()
        await wrapper.vm.$nextTick()
      })

      it('does not display a "SpinnerWithMessage" component', () => {
        const spinner = wrapper.find('.SpinnerWithMessage_test')
        expect(spinner.exists()).toBe(false)
      })

      describe('when "trail" is listed in player history', () => {
        beforeAll(async () => {
          wrapper.vm.$store.commit('user/setOpenTrails', [trailId])
          await wrapper.vm.$nextTick()
        })

        it('displays "Station" component', () => {
          const station = wrapper.find('.Station_test')
          expect(station.exists()).toBe(true)
        })

        it('does not display trailInfo component', () => {
          const trailInfo = wrapper.find('.TrailInfo_test')
          expect(trailInfo.exists()).toBe(false)
        })

        it('does not display a "StartTrail" component', () => {
          const startTrail = wrapper.find('.StartTrail_test')
          expect(startTrail.exists()).toBe(false)
        })
      })

      describe('when "trail" is not listed in player history', () => {
        beforeAll(async () => {
          wrapper.vm.$store.commit('user/setOpenTrails', [])
          await wrapper.vm.$nextTick()
        })

        it('does not display a "Station" component', () => {
          const station = wrapper.find('.Station_test')
          expect(station.exists()).toBe(false)
        })

        it('displays a "trailInfo" component', () => {
          const trailInfo = wrapper.find('.TrailInfo_test')
          expect(trailInfo.exists()).toBe(true)
        })

        describe('when "station" is not a "trailEntry" in trail', () => {
          beforeAll(async () => {
            wrapper.vm.$store.commit('trails/setTrail', closedTestTrail)
            await wrapper.vm.$nextTick()
          })

          it('does not display a "StartTrail" component', () => {
            const startTrail = wrapper.find('.StartTrail_test')
            expect(startTrail.exists()).toBe(false)
          })

          it('displays an "InaccessibleStationInfo" component', () => {
            const inaccessible = wrapper.find('.InaccessibleStationInfo_test')
            expect(inaccessible.exists()).toBe(true)
          })
        })

        describe('when "station" is a "trailEntry" in trail', () => {
          beforeAll(async () => {
            wrapper.vm.$store.commit('trails/setTrail', testTrail)
            await wrapper.vm.$nextTick()
          })

          it('displays a "StartTrail" component', () => {
            const startTrail = wrapper.find('.StartTrail_test')
            expect(startTrail.exists()).toBe(true)
          })

          it('does not an "InaccessibleStationInfo" component', () => {
            const inaccessible = wrapper.find('.InaccessibleStationInfo_test')
            expect(inaccessible.exists()).toBe(false)
          })

          describe('when "startTrail" emits "start"', () => {
            beforeAll(async () => {
              const startTrail = wrapper.find('.StartTrail_test')
              startTrail.vm.$emit('start')
              await wrapper.vm.$nextTick()
            })

            it('displays "Station" component', () => {
              const station = wrapper.find('.Station_test')
              expect(station.exists()).toBe(true)
            })

            it('does not display trailInfo component', () => {
              const trailInfo = wrapper.find('.TrailInfo_test')
              expect(trailInfo.exists()).toBe(false)
            })

            it('does not display a "StartTrail" component', () => {
              const startTrail = wrapper.find('.StartTrail_test')
              expect(startTrail.exists()).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('when station does not exist', () => {
    beforeAll(async () => {
      wrapper = mountQuasar(StationLayout, {
        store,
        mocks: {
          $route,
          $router,
          $q
        }
      })
      store.modules.trails.actions.downloadTrail.mockResolvedValue()
      store.modules.trails.actions.downloadStation.mockRejectedValue(new Error('station does not exist'))
      await wrapper.vm.$nextTick()
    })

    it('notifies the user', () => {
      expect($q.notify).toHaveBeenCalled()
    })

    it('updates trail access', () => {
      expect(store.modules.user.actions.updateTrailAccess).toHaveBeenCalled()
    })

    describe('when trail access is updated', () => {
      beforeAll(async () => {
        store.modules.user.actions.updateTrailAccess.mockResolvedValue()
        await wrapper.vm.$nextTick()
      })

      it('routes back the user', () => {
        expect($router.back).toHaveBeenCalled()
      })
    })
  })
})
