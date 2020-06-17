import { mountQuasar } from '@test'
import ClueEditor from './ClueEditor'

const clueId = 'testClueId'
const chaseId = 'testChaseId'

const testClue = {
  name: 'testClueName',
  rows: [
    {
      type: 'text',
      value: '<div>TEST TEXT</div>'
    },
    {
      type: 'image',
      value: 'url/to/image'
    }
  ]
}
const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        updateClueInChase: jest.fn()
      },
      getters: {
        getClue: () => () => {
          return testClue
        }
      }
    }
  }
}

describe('ClueEditor', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(ClueEditor, {
      propsData: {
        clueId,
        chaseId
      },
      store
    })
    await wrapper.vm.$nextTick()
  })

  it('initializes "name" data to "clue.name"', () => {
    expect(wrapper.vm.name).toBe(testClue.name)
  })

  it('initializes "rows" data to "clue.row"', () => {
    expect(wrapper.vm.rows).toEqual(testClue.rows)
  })

  it('displays a "QInput" for "name"', () => {
    const qInput = wrapper.find('.QInputName_test')
    expect(qInput.props().value).toBe(testClue.name)
  })

  it('displays a "ClueRow" for each row', () => {
    const rows = wrapper.findAll('.ClueRow_test')
    expect(rows.length).toBe(testClue.rows.length)
  })

  describe('when a "ClueRow" emits "remove"', () => {
    beforeAll(async () => {
      const row = wrapper.find('.ClueRow_test')
      row.vm.$emit('remove')
      await wrapper.vm.$nextTick()
    })

    it('removes the corresponding row', () => {
      expect(wrapper.vm.rows).toEqual([testClue.rows[1]])
    })

    afterAll(async () => {
      wrapper.setData({ rows: [...testClue.rows] })
      await wrapper.vm.$nextTick()
    })
  })

  it('displays an "AddRow" button', () => {
    const btn = wrapper.find('.AddRow_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "AddRow" button emits "click"', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.AddRow_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('adds one row', () => {
      expect(wrapper.vm.rows.length).toBe(testClue.rows.length + 1)
    })

    afterAll(async () => {
      wrapper.setData({ rows: [...testClue.rows] })
      await wrapper.vm.$nextTick()
    })
  })

  it('displays an "update" button', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "update" button emits "click"', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.UpdateBtn_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('updates the clue in the chase on server', () => {
      expect(store.modules.editor.actions.updateClueInChase).toHaveBeenCalledWith(
        expect.any(Object),
        {
          chaseId,
          clueId,
          newProps: testClue
        }
      )
    })
  })
})
