import { mountQuasar } from '@test'
import EditorFastAccess from './EditorFastAccess'

const testChaseId = 'testChaseId'
const testClueId = 'testClueId'

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myChases: () => {
          return {}
        },
        getChase: () => () => {
          return {
            name: 'testChaseName',
            id: 'testChaseId',
            chaseScheme: {}
          }
        }
      }
    }
  }
}

describe('EditorFastAccess', () => {
  const wrapper = mountQuasar(EditorFastAccess, {
    store
  })

  it('displays a "unselect" button', () => {
    const btn = wrapper.find('.UnselectBtn_test')
    expect(btn.exists()).toBe(true)
  })

  it('emits "unselect" value when "unselect" button emits "click"', () => {
    const btn = wrapper.find('.UnselectBtn_test')
    btn.vm.$emit('click')
    expect(wrapper.emitted().unselect).toBeTruthy()
  })

  it('displays a "QSelect" for chase', () => {
    const qSelect = wrapper.find('.QSelectChase_test')
    expect(qSelect.exists()).toBe(true)
  })

  it('emits "editChase" value when "QSelect" for chase emits "input"', () => {
    const qSelect = wrapper.find('.QSelectChase_test')
    qSelect.vm.$emit('input', { value: testChaseId })
    expect(wrapper.emitted().editChase[0][0]).toBe(testChaseId)
  })

  describe('when "selectedChase" is undefined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedChase: undefined,
        selectedClue: undefined
      })
      await wrapper.vm.$nextTick()
    })

    it('displays no "QSelect" for clue', () => {
      const qSelect = wrapper.find('.QSelectClue_test')
      expect(qSelect.exists()).toBe(false)
    })
  })

  describe('when "selectedChase" is defined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedChase: testChaseId
      })
      await wrapper.vm.$nextTick()
    })

    it('displays a "QSelect" for clue', () => {
      const qSelect = wrapper.find('.QSelectClue_test')
      expect(qSelect.exists()).toBe(true)
    })

    it('emits "editClue" value when "QSelect" for clue emits "input"', () => {
      const qSelect = wrapper.find('.QSelectClue_test')
      qSelect.vm.$emit('input', { value: testClueId })
      expect(wrapper.emitted().editClue[0][0]).toBe(testClueId)
    })
  })
})
