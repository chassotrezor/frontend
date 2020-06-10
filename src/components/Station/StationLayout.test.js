import { mountQuasar } from '@test'
import StationLayout from './StationLayout'

describe('StationLayout', () => {
  const chaseId = 'testChaseId'
  const clueId = 'testClueId'

  const $route = {
    params: {
      chaseId,
      clueId
    }
  }

  const store = {
    modules: {
      chase: {
        namespaced: true,
        actions: {
          downloadClue: jest.fn()
        },
        getters: {
          getClue: state => () => state.clue
        },
        mutations: {
          setClue: (state, clue) => { state.clue = clue }
        },
        state: () => {
          return {
            clue: undefined
          }
        }
      },
      user: {
        namespaced: true,
        getters: {
          openedChases: state => state.openedChases
        },
        mutations: {
          setOpenedChases: (state, openedChases) => { state.openedChases = openedChases }
        },
        state: () => {
          return {
            openedChases: []
          }
        }
      }
    }
  }

  const wrapper = mountQuasar(StationLayout, {
    store,
    mocks: {
      $route
    }
  })

  describe('when "playerIsChasing" is true', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setOpenedChases', [chaseId])
      wrapper.vm.$nextTick(done)
    })

    it('displays a "SpinnerWithMessage" component', () => {
      const spinner = wrapper.find('.SpinnerWithMessage_test')
      expect(spinner.exists()).toBeTruthy()
    })

    describe('when clue data is downloaded', () => {
      beforeAll(done => {
        store.modules.chase.actions.downloadClue.mockResolvedValue()
        wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
        wrapper.vm.$nextTick(done)
      })

      it('displays "Clue" component', () => {
        const clue = wrapper.find('.Clue_test')
        expect(clue.exists()).toBeTruthy()
      })

      it('does not display chaseInfo component', () => {
        const chaseInfo = wrapper.find('.ChaseInfo_test')
        expect(chaseInfo.exists()).toBeFalsy()
      })

      describe('when "clue.isChaseEntry" is true', () => {
        beforeAll(done => {
          wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
          wrapper.vm.$nextTick(done)
        })

        it('does not display a "StartChase" component', () => {
          const startChase = wrapper.find('.StartChase_test')
          expect(startChase.exists()).toBeFalsy()
        })
      })
    })
  })

  describe('when "playerIsChasing" prop is false', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setOpenedChases', [])
      wrapper.vm.$nextTick(done)
    })

    it('does not display clue component', () => {
      const clue = wrapper.find('.Clue_test')
      expect(clue.exists()).toBeFalsy()
    })

    it('displays chaseInfo slot', () => {
      const chaseInfo = wrapper.find('.ChaseInfo_test')
      expect(chaseInfo.exists()).toBeTruthy()
    })

    describe('when "isChaseEntry" prop is true', () => {
      beforeAll(done => {
        wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
        wrapper.vm.$nextTick(done)
      })

      it('displays a "StartChase" component', () => {
        const startChase = wrapper.find('.StartChase_test')
        expect(startChase.exists()).toBeTruthy()
      })
    })
  })
})
