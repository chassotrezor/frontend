import { mountQuasar } from '@test'
import ChaseSummary from './ChaseSummary'

const chaseId = 'testChaseId'

const chaseScheme = {
  testClueId1: {
    id: 'testClueId1',
    name: 'testClueName1'
  },
  testClueId2: {
    id: 'testClueId2',
    name: 'testClueName2'
  }
}

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getChase: () => () => {
          return { chaseScheme }
        }
      }
    }
  }
}

describe('ChaseSummary', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(ChaseSummary, {
      store,
      propsData: {
        chaseId
      }
    })
    wrapper.vm.$nextTick(done)
  })

  it('displays an "EditClue" component for each clue in chase', () => {
    const clues = wrapper.findAll('.EditClue_test')
    expect(clues.length).toBe(Object.keys(chaseScheme).length)
  })

  describe('when one "EditClue" component emits "edit" with value "clueId"', () => {
    let clueId
    beforeAll(done => {
      const clue = wrapper.find('.EditClue_test')
      clueId = clue.props().clue.id
      clue.vm.$emit('edit', clueId)
      wrapper.vm.$nextTick(done)
    })

    it('emits "editClue" event with value "clueId"', () => {
      expect(wrapper.emitted('editClue')[0][0]).toBe(clueId)
    })
  })
})
