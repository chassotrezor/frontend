import { mountQuasar } from '@test'
import StationLayout from './StationLayout'

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

describe('StationLayout', () => {
  it('displays a "SpinnerWithMessage" component', () => {
    const spinner = wrapper.find('.SpinnerWithMessage_test')
    expect(spinner.exists()).toBe(true)
  })

  describe('when "playerIsChasing" is true', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setOpenedChases', [chaseId])
      wrapper.vm.$nextTick(done)
    })

    describe('when clue data is downloaded', () => {
      beforeAll(done => {
        store.modules.chase.actions.downloadClue.mockResolvedValue()
        wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
        wrapper.vm.$nextTick(done)
      })

      it('does not display a "SpinnerWithMessage" component', () => {
        const spinner = wrapper.find('.SpinnerWithMessage_test')
        expect(spinner.exists()).toBe(false)
      })

      it('displays "Clue" component', () => {
        const clue = wrapper.find('.Clue_test')
        expect(clue.exists()).toBe(true)
      })

      it('does not display chaseInfo component', () => {
        const chaseInfo = wrapper.find('.ChaseInfo_test')
        expect(chaseInfo.exists()).toBe(false)
      })

      describe('when "clue.isChaseEntry" is true', () => {
        beforeAll(done => {
          wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
          wrapper.vm.$nextTick(done)
        })

        it('does not display a "StartChase" component', () => {
          const startChase = wrapper.find('.StartChase_test')
          expect(startChase.exists()).toBe(false)
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
      expect(clue.exists()).toBe(false)
    })

    it('displays chaseInfo slot', () => {
      const chaseInfo = wrapper.find('.ChaseInfo_test')
      expect(chaseInfo.exists()).toBe(true)
    })

    describe('when "isChaseEntry" prop is true', () => {
      beforeAll(done => {
        wrapper.vm.$store.commit('chase/setClue', { isChaseEntry: true })
        wrapper.vm.$nextTick(done)
      })

      it('displays a "StartChase" component', () => {
        const startChase = wrapper.find('.StartChase_test')
        expect(startChase.exists()).toBe(true)
      })
    })
  })
})
