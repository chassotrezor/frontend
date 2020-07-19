import { mountQuasar } from '@test'
import StationEditor from './StationEditor'
import types from 'src/types'

const stationId = 'testStationId'
const trailId = 'testTrailId'

const testTrail = {
  name: 'testTrailName',
  graph: {
    nodes: {
      [stationId]: {
        name: 'testStationName'
      }
    },
    endNodes: [],
    trailEntries: []
  }
}

const testStation = {
  rows: [
    {
      rowId: 'id1',
      type: 'text',
      data: { rawHtml: '<div>TEST TEXT</div>' }
    },
    {
      rowId: 'id2',
      type: 'image',
      data: { url: 'url/to/image' }
    }
  ]
}

const store = {
  modules: {
    editor: {
      namespaced: true,
      actions: {
        updateStationInTrail: jest.fn(),
        updateTrail: jest.fn()
      },
      getters: {
        getStation: () => () => testStation,
        getTrail: () => () => testTrail
      }
    }
  }
}

describe('StationEditor', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(StationEditor, {
      propsData: {
        stationId,
        trailId
      },
      store
    })
    await wrapper.vm.$nextTick()
  })

  it('initializes "name" data to "station.name"', () => {
    expect(wrapper.vm.name).toBe(testStation.name)
  })

  it('initializes "rows" data to "station.row"', () => {
    expect(wrapper.vm.rows).toEqual(testStation.rows)
  })

  it('displays a "StationPreview"', () => {
    const preview = wrapper.find('.StationPreview_test')
    expect(preview.exists()).toBe(true)
  })

  it('displays a "QInput" for "name"', () => {
    const qInput = wrapper.find('.QInputName_test')
    expect(qInput.props().value).toBe(testTrail.graph.nodes[stationId].name)
  })

  describe('station rows', () => {
    it('displays a "StationRow" for each row', () => {
      const rows = wrapper.findAll('.StationRow_test')
      expect(rows.length).toBe(testStation.rows.length)
    })

    it('sets "first" prop to true if and only if StationRow is first of list', () => {
      const rows = wrapper.findAll('.StationRow_test')
      wrapper.vm.rows.forEach((row, index) => {
        expect(rows.at(index).props().first).toBe(index === 0)
      })
    })

    it('sets "last" prop to true if and only if StationRow is last of list', () => {
      const rows = wrapper.findAll('.StationRow_test')
      wrapper.vm.rows.forEach((row, index) => {
        expect(rows.at(index).props().last).toBe(index === rows.length - 1)
      })
    })

    describe('when a "StationRow" emits "remove"', () => {
      beforeAll(async () => {
        const row = wrapper.find('.StationRow_test')
        row.vm.$emit('remove')
        await wrapper.vm.$nextTick()
      })

      it('removes the corresponding row', () => {
        expect(wrapper.vm.rows).toEqual([testStation.rows[1]])
      })

      afterAll(async () => {
        wrapper.setData({ rows: [...testStation.rows] })
        await wrapper.vm.$nextTick()
      })
    })

    describe('when a "StationRow" emits "up"', () => {
      beforeAll(async () => {
        const rows = wrapper.findAll('.StationRow_test')
        rows.at(1).vm.$emit('up')
        await wrapper.vm.$nextTick()
      })

      it('permutes corresponding row and previous row', () => {
        expect(wrapper.vm.rows[1]).toEqual(testStation.rows[0])
        expect(wrapper.vm.rows[0]).toEqual(testStation.rows[1])
      })

      afterAll(async () => {
        wrapper.setData({ rows: [...testStation.rows] })
        await wrapper.vm.$nextTick()
      })
    })

    describe('when a "StationRow" emits "down"', () => {
      beforeAll(async () => {
        const rows = wrapper.findAll('.StationRow_test')
        rows.at(0).vm.$emit('down')
        await wrapper.vm.$nextTick()
      })

      it('permutes corresponding row and next row', () => {
        expect(wrapper.vm.rows[1]).toEqual(testStation.rows[0])
        expect(wrapper.vm.rows[0]).toEqual(testStation.rows[1])
      })

      afterAll(async () => {
        wrapper.setData({ rows: [...testStation.rows] })
        await wrapper.vm.$nextTick()
      })
    })
  })

  describe('"AddRow" button group', () => {
    it('adds one TextRow when "AddText" button emits "click"', async () => {
      const btn = wrapper.find('.AddText_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
      const length = wrapper.vm.rows.length
      expect(length).toBe(testStation.rows.length + 1)
      const lastRow = wrapper.vm.rows[length - 1]
      expect(lastRow.type).toBe(types.rows.TEXT)
      wrapper.setData({ rows: [...testStation.rows] })
      await wrapper.vm.$nextTick()
    })

    it('adds one ImageRow when "AddImage" button emits "click"', async () => {
      const btn = wrapper.find('.AddImage_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
      const length = wrapper.vm.rows.length
      expect(length).toBe(testStation.rows.length + 1)
      const lastRow = wrapper.vm.rows[length - 1]
      expect(lastRow.type).toBe(types.rows.IMAGE)
      wrapper.setData({ rows: [...testStation.rows] })
      await wrapper.vm.$nextTick()
    })
  })

  it('displays an "UpdateBtn"', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "UpdateBtn" calls "updateFn', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.UpdateBtn_test')
      btn.props().updateFn()
      await wrapper.vm.$nextTick()
    })

    it('updates the station in the trail on server', () => {
      expect(store.modules.editor.actions.updateStationInTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          stationId,
          newProps: testStation
        }
      )
    })
  })
})
