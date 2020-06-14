import { mountQuasar } from '@test'
import EditClue from './EditClue'

const testClueId = 'testClueId'

describe('EditClue', () => {
  const wrapper = mountQuasar(EditClue, {
    propsData: {
      clue: {
        id: testClueId
      }
    }
  })

  describe('when clicked', () => {
    beforeAll(() => {
      wrapper.trigger('click')
    })

    it('emits "edit" event with value "clueId"', () => {
      expect(wrapper.emitted('edit')[0][0]).toBe(testClueId)
    })
  })
})
