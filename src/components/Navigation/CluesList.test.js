import { mountQuasar } from '@test'
import CluesList from './CluesList'

const defaultAccessibleClues = {
  testTrailId1: {
    clues: {
      testClueId11: {
        name: 'test clue name 11'
      },
      testClueId12: {
        name: 'test clue name 12'
      }
    },
    data: {
      name: 'test trail name 1'
    }
  },
  testTrailId2: {
    clues: {
      testClueId21: {
        name: 'test clue name 21'
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
        accessibleClues: state => state.accessibleClues,
        lastTrail: state => state.lastTrail
      },
      mutations: {
        setAccessibleClues: (state, value) => { state.accessibleClues = value },
        setLasttrail: (state, value) => { state.lastTrail = value }
      },
      state: () => {
        return {
          accessibleClues: defaultAccessibleClues,
          lastTrail: defaultLastTrail
        }
      }
    }
  }
}

const $router = {
  push: jest.fn()
}

describe('CluesList', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(CluesList, {
      store,
      mocks: {
        $router
      }
    })
    wrapper.vm.$nextTick(done)
  })

  it('sets value of "selectedTrail" to { value: lastTrailId, label: lastTrailName }', () => {
    const trailName = defaultAccessibleClues[defaultLastTrail].data.name
    expect(wrapper.vm.selectedTrail).toEqual({
      value: defaultLastTrail,
      label: trailName
    })
  })

  describe('when "selectedTrail" and "accessibleClues" match', () => {
    it('displays a "QSelect" component with options [{ value: trailId, label: trailName }]', () => {
      const select = wrapper.find('.QSelect_test')
      expect(select.props().options).toEqual([
        { value: 'testTrailId1', label: 'test trail name 1' },
        { value: 'testTrailId2', label: 'test trail name 2' }
      ])
    })

    it('displays a "QItem" component for each clue in accessibleClues[trailId].clues', () => {
      const qItems = wrapper.findAll('.QItem_test')
      const expectedLength = Object.keys(defaultAccessibleClues[defaultLastTrail].clues).length
      expect(qItems.length).toBe(expectedLength)
    })

    describe('when "QItem" emits "click" event', () => {
      beforeAll(done => {
        const qItem = wrapper.find('.testClueId11_test')
        qItem.vm.$emit('click')
        wrapper.vm.$nextTick(done)
      })

      test('router pushes to /trail/[trailId]/clue/[clueId]', () => {
        const expectedRoute = {
          name: 'clue',
          params: {
            trailId: 'testTrailId1',
            clueId: 'testClueId11'
          }
        }
        expect($router.push).toHaveBeenCalledWith(expectedRoute)
      })
    })
  })

  describe('when "selectedTrail" does not match "accessibleClues', () => {
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

  describe('when "accessibleClues" is empty or undefined', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setAccessibleClues', undefined)
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

    it('displays "no clue yet"', () => {
      expect(wrapper.text().includes('no clue yet')).toBe(true)
    })
  })
})
