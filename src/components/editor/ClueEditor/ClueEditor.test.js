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

  describe('clue rows', () => {
    it('displays a "ClueRow" for each row', () => {
      const rows = wrapper.findAll('.ClueRow_test')
      expect(rows.length).toBe(testClue.rows.length)
    })

    it('sets "first" prop to true if and only if ClueRow is first of list', () => {
      const rows = wrapper.findAll('.ClueRow_test')
      wrapper.vm.rows.forEach((row, index) => {
        expect(rows.at(index).props().first).toBe(index === 0)
      })
    })

    it('sets "last" prop to true if and only if ClueRow is last of list', () => {
      const rows = wrapper.findAll('.ClueRow_test')
      wrapper.vm.rows.forEach((row, index) => {
        expect(rows.at(index).props().last).toBe(index === rows.length - 1)
      })
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

    describe('when a "ClueRow" emits "up"', () => {
      beforeAll(async () => {
        const rows = wrapper.findAll('.ClueRow_test')
        rows.at(1).vm.$emit('up')
        await wrapper.vm.$nextTick()
      })

      it('permutes corresponding row and previous row', () => {
        expect(wrapper.vm.rows[1]).toEqual(testClue.rows[0])
        expect(wrapper.vm.rows[0]).toEqual(testClue.rows[1])
      })

      afterAll(async () => {
        wrapper.setData({ rows: [...testClue.rows] })
        await wrapper.vm.$nextTick()
      })
    })

    describe('when a "ClueRow" emits "down"', () => {
      beforeAll(async () => {
        const rows = wrapper.findAll('.ClueRow_test')
        rows.at(0).vm.$emit('down')
        await wrapper.vm.$nextTick()
      })

      it('permutes corresponding row and next row', () => {
        expect(wrapper.vm.rows[1]).toEqual(testClue.rows[0])
        expect(wrapper.vm.rows[0]).toEqual(testClue.rows[1])
      })

      afterAll(async () => {
        wrapper.setData({ rows: [...testClue.rows] })
        await wrapper.vm.$nextTick()
      })
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
