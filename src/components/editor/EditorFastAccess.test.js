import { mountQuasar } from '@test'
import EditorFastAccess from './EditorFastAccess'

const testTrailId = 'testTrailId'
const testClueId = 'testClueId'

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myTrails: () => {
          return {}
        },
        getTrail: () => () => {
          return {
            name: 'testTrailName',
            id: 'testTrailId',
            trailScheme: {}
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

  it('displays a "QSelect" for trail', () => {
    const qSelect = wrapper.find('.QSelectTrail_test')
    expect(qSelect.exists()).toBe(true)
  })

  it('emits "editTrail" value when "QSelect" for trail emits "input"', () => {
    const qSelect = wrapper.find('.QSelectTrail_test')
    qSelect.vm.$emit('input', { value: testTrailId })
    expect(wrapper.emitted().editTrail[0][0]).toBe(testTrailId)
  })

  describe('when "selectedTrail" is undefined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedTrail: undefined,
        selectedClue: undefined
      })
      await wrapper.vm.$nextTick()
    })

    it('displays no "QSelect" for clue', () => {
      const qSelect = wrapper.find('.QSelectClue_test')
      expect(qSelect.exists()).toBe(false)
    })
  })

  describe('when "selectedTrail" is defined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedTrail: testTrailId
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
