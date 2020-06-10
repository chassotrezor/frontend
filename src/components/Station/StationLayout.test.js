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
          downloadClue: jest.fn().mockResolvedValue()
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
      }
    }
  }

  const wrapper = mountQuasar(StationLayout, {
    store,
    mocks: {
      $route
    }
  })

  function setClue (clue, done) {
    wrapper.vm.$store.commit('chase/setClue', clue)
    wrapper.vm.$nextTick(done)
  }

  describe('when "playerIsChasing" is true', () => {
    beforeAll(done => {
      wrapper.vm.playerIsChasing = true
      wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
      wrapper.vm.$nextTick(done)
    })

    it('displays clue component', () => {
      const clue = wrapper.find('.Clue_test')
      expect(clue.exists()).toBeTruthy()
    })

    it('does not display chaseInfo component', () => {
      const chaseInfo = wrapper.find('.ChaseInfo_test')
      expect(chaseInfo.exists()).toBeFalsy()
    })

    describe('when "clue.isChaseEntry" is true', () => {
      beforeAll(done => {
        setClue({
          isChaseEntry: true
        }, done)
      })

      it('does not display a "StartChase" component', () => {
        const startChase = wrapper.find('.StartChase_test')
        expect(startChase.exists()).toBeFalsy()
      })
    })
  })

  describe('when "playerIsChasing" prop is false', () => {
    beforeAll(done => {
      wrapper.vm.playerIsChasing = false
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
        setClue({
          isChaseEntry: true
        }, done)
      })

      it('displays a "StartChase" component', () => {
        const startChase = wrapper.find('.StartChase_test')
        expect(startChase.exists()).toBeTruthy()
      })
    })
  })
})
