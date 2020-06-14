import { mountQuasar } from '@test'
import Editor from './Editor'

const testChaseId = 'testChaseId'
const testClueId = 'testClueId'

describe('Editor', () => {
  const wrapper = mountQuasar(Editor)

  it('displays a "MyChases" component', () => {
    const myChases = wrapper.find('.MyChases_test')
    expect(myChases.exists()).toBe(true)
  })

  it('displays no "ChaseSummary" component', () => {
    const chaseSummary = wrapper.find('.ChaseSummary_test')
    expect(chaseSummary.exists()).toBe(false)
  })

  describe('when "MyChases" emits "open" with "chaseId" param', () => {
    beforeAll(done => {
      const myChases = wrapper.find('.MyChases_test')
      myChases.vm.$emit('open', testChaseId)
      wrapper.vm.$nextTick(done)
    })

    it('displays no "MyChases" component', () => {
      const myChases = wrapper.find('.MyChases_test')
      expect(myChases.exists()).toBe(false)
    })

    it('displays a "ChaseSummary" component with "chase-id" prop set to "chaseId"', () => {
      const chaseSummary = wrapper.find('.ChaseSummary_test')
      expect(chaseSummary.props().chaseId).toBe(testChaseId)
    })

    describe('when "ChaseSummary" emits "editClue" with value "clueId"', () => {
      beforeAll(done => {
        const chaseSummary = wrapper.find('.ChaseSummary_test')
        chaseSummary.vm.$emit('editClue', testClueId)
        wrapper.vm.$nextTick(done)
      })

      it('displays a "ClueEditor" component', () => {
        const clueEditor = wrapper.find('.ClueEditor_test')
        expect(clueEditor.exists()).toBe(true)
      })
    })
  })
})
