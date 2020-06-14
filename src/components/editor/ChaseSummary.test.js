import { mountQuasar } from '@test'
import ChaseSummary from './ChaseSummary'

const chaseId = 'testChaseId'

const chaseScheme = {
  testClueId1: {
    name: 'testClueName1'
  },
  testClueId2: {
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
})