import { mountQuasar } from '@test'
import CluesList from './CluesList'

const defaultAccessibleClues = {
  testChaseId1: {
    clues: {
      testClueId11: {
        name: 'test clue name 11'
      },
      testClueId12: {
        name: 'test clue name 12'
      }
    },
    data: {
      name: 'test chase name 1'
    }
  },
  testChaseId2: {
    clues: {
      testClueId21: {
        name: 'test clue name 21'
      }
    },
    data: {
      name: 'test chase name 2'
    }
  }
}

const defaultLastChase = 'testChaseId1'

const store = {
  modules: {
    user: {
      namespaced: true,
      getters: {
        accessibleClues: state => state.accessibleClues,
        lastChase: state => state.lastChase
      },
      mutations: {
        setAccessibleClues: (state, value) => { state.accessibleClues = value },
        setLastchase: (state, value) => { state.lastChase = value }
      },
      state: () => {
        return {
          accessibleClues: defaultAccessibleClues,
          lastChase: defaultLastChase
        }
      }
    }
  }
}

describe('CluesList', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(CluesList, {
      store
    })
    wrapper.vm.$nextTick(done)
  })

  it('sets value of "selectedChase" to { value: lastChaseId, label: lastChaseName }', () => {
    const chaseName = defaultAccessibleClues[defaultLastChase].data.name
    expect(wrapper.vm.selectedChase).toEqual({
      value: defaultLastChase,
      label: chaseName
    })
  })

  describe('when "selectedChase" and "accessibleClues" match', () => {
    it('displays a "QSelect" component with options [{ value: chaseId, label: chaseName }]', () => {
      const select = wrapper.find('.QSelect_test')
      expect(select.props().options).toEqual([
        { value: 'testChaseId1', label: 'test chase name 1' },
        { value: 'testChaseId2', label: 'test chase name 2' }
      ])
    })

    it('displays a "QItem" component for each clue in accessibleClues[chaseId].clues', () => {
      const qItems = wrapper.findAll('.QItem_test')
      const expectedLength = Object.keys(defaultAccessibleClues[defaultLastChase].clues).length
      expect(qItems.length).toBe(expectedLength)
    })
  })

  describe('when "selectedChase" does not match "accessibleClues', () => {
    beforeAll(done => {
      wrapper.vm.selectedChase = 'NO_MATCH'
      wrapper.vm.$nextTick(done)
    })

    it('displays a "QSelect" component with options [{ value: chaseId, label: chaseName }]', () => {
      const select = wrapper.find('.QSelect_test')
      expect(select.props().options).toEqual([
        { value: 'testChaseId1', label: 'test chase name 1' },
        { value: 'testChaseId2', label: 'test chase name 2' }
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
