import { mountQuasar } from '@test'
import TrailEditor from './TrailEditor'
import types from 'src/types'

jest.mock('vue-pdf', () => {
  return {
    name: 'VuePdf'
  }
})
jest.mock('jspdf', () => {})

const expectedGeoPoint = { Ac: 0, Rc: 0 }
const $geo = {
  point: () => expectedGeoPoint
}

const trailId = 'testTrailId'

const trail = {
  graph: {
    trailEntries: ['testNodeId1'],
    nodes: {
      testNodeId1: {
        name: 'testStationName1',
        position: { Ac: 1, Rc: 1 },
        type: types.nodes.STATION,
        dependencies: []
      },
      testNodeId2: {
        name: 'testStationName2',
        position: { Ac: 2, Rc: 2 },
        type: types.nodes.STATION,
        dependencies: ['testNodeId1']
      }
    },
    endNodes: ['testNodeId2']
  },
  name: 'testTrailName',
  position: { AC: 3, RC: 3 },
  description: '<div>Description</div>',
  durationMinutes: 90,
  physicalEffort: 3,
  mentalEffort: 3,
  pdfData: {
    colors: {
      light: '#111111',
      dark: '#EEEEEE'
    },
    width: 160
  },
  mapData: {
    zoom: 7
  }
}

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail
      },
      actions: {
        updateTrail: jest.fn(),
        createStation: jest.fn(),
        removeStationInTrail: jest.fn()
      }
    }
  }
}

const $sanitize = rawHtml => rawHtml

describe('TrailEditor', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(TrailEditor, {
      store,
      propsData: {
        trailId
      },
      mocks: {
        $geo,
        $sanitize
      }
    })
    await wrapper.vm.$nextTick()
  })

  describe('Trail properties', () => {
    it('displays an input for trail name', () => {
      const input = wrapper.find('.InputName_test')
      expect(input.props().value).toBe(trail.name)
    })

    it('displays an input for trail description', () => {
      const input = wrapper.find('.InputDescription_test')
      expect(input.props().value).toBe(trail.description)
    })

    it('displays an input for trail duration', () => {
      const input = wrapper.find('.InputDuration_test')
      expect(input.props().value).toBe(trail.durationMinutes)
    })

    it('displays an input for trail physical effort', () => {
      const input = wrapper.find('.InputPhysicalEffort_test')
      expect(input.props().value).toBe(trail.physicalEffort)
    })

    it('displays an input for trail mental effort', () => {
      const input = wrapper.find('.InputMentalEffort_test')
      expect(input.props().value).toBe(trail.mentalEffort)
    })
  })

  it('displays an "UpdateBtn"', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  it('displays a "PublishToggle"', () => {
    const toggle = wrapper.find('.TogglePublish_test')
    expect(toggle.exists()).toBe(true)
  })

  describe('when "UpdateBtn" calls "updateFn"', () => {
    const expectedName = 'newName'

    beforeAll(async () => {
      wrapper.vm.name = expectedName
      const btn = wrapper.find('.UpdateBtn_test')
      btn.props().updateFn()
      await wrapper.vm.$nextTick()
    })

    it('updates the properties of this trail on server', () => {
      expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          newProps: {
            ...trail,
            name: expectedName,
            position: expectedGeoPoint
          }
        }
      )
    })

    afterAll(jest.clearAllMocks)
  })

  describe('TrailGraph', () => {
    let trailGraph
    beforeAll(() => { trailGraph = wrapper.find('.TrailGraph_test') })

    describe('when "TrailGraph" emits "update:zoom"', () => {
      it('updates "mapData.zoom"', async () => {
        const newZoom = 12
        trailGraph.vm.$emit('update:zoom', newZoom)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.mapData.zoom).toEqual(newZoom)
      })
    })

    describe('When TrailGraph emits "editStation" with "stationId"', () => {
      it('emits "editStation" with value stationId', async () => {
        const stationId = 'stationId'
        trailGraph.vm.$emit('editStation', stationId)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
      })
    })

    describe('When TrailGraph emits "updateName" with "{ stationId, newName }"', () => {
      it('sets updates the station name', async () => {
        const stationId = 'testNodeId1'
        const newName = 'testStationNewName'
        trailGraph.vm.$emit('updateName', { stationId, newName })
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.graph.nodes[stationId].name).toEqual(newName)
      })
    })

    describe('When TrailGraph emits "updateGraph" with "newGraph"', () => {
      it('sets "graph" to "newGraph"', async () => {
        const newGraph = {
          trailEntries: ['testNodeId2'],
          nodes: {
            testNodeId1: {
              name: 'testStationName1',
              position: { Ac: 1, Rc: 1 },
              type: types.nodes.STATION,
              dependencies: ['testNodeId2']
            },
            testNodeId2: {
              name: 'testStationName2',
              position: { Ac: 2, Rc: 2 },
              type: types.nodes.STATION,
              dependencies: []
            }
          },
          endNodes: ['testNodeId1']
        }
        trailGraph.vm.$emit('updateGraph', newGraph)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.graph).toEqual(newGraph)
      })
    })

    describe('When TrailGraph emits "createStation" with { newGraph, newStationId } when all changes are saved', () => {
      const newStationId = 'stationId'
      beforeAll(async () => {
        wrapper.vm.duplicateTrail(wrapper.vm.trail)
        await wrapper.vm.$nextTick()
        const newGraph = trail.graph
        trailGraph.vm.$emit('createStation', { newGraph, newStationId })
        store.modules.editor.actions.updateTrail.mockResolvedValueOnce()
        await wrapper.vm.$nextTick()
      })

      it('updates trail on server', async () => {
        expect(store.modules.editor.actions.updateTrail).toHaveBeenCalled()
      })

      it('creates a new station on server with "newStationId"', () => {
        expect(store.modules.editor.actions.createStation).toHaveBeenCalledWith(
          expect.any(Object),
          {
            trailId,
            stationId: newStationId
          }
        )
      })

      afterAll(jest.clearAllMocks)
    })

    describe('When TrailGraph emits "createStation" with { newGraph, newStationId } when some changes are unsaved', () => {
      const newStationId = 'stationId'
      beforeAll(async () => {
        const changedTrail = JSON.parse(JSON.stringify(trail))
        changedTrail.name = 'otherName'
        wrapper.vm.duplicateTrail(changedTrail)
        await wrapper.vm.$nextTick()
        const newGraph = trail.graph
        trailGraph.vm.$emit('createStation', { newGraph, newStationId })
        await wrapper.vm.$nextTick()
      })

      it('opens a dialog', () => {
        expect(wrapper.vm.dialog.open).toBe(true)
      })

      it('waits for user validation for updating trail on server', async () => {
        expect(store.modules.editor.actions.updateTrail).not.toHaveBeenCalled()
      })

      it('waits for user validation for creating a new station on server', () => {
        expect(store.modules.editor.actions.createStation).not.toHaveBeenCalled()
      })

      describe('when user click on "OK"', () => {
        beforeAll(async () => {
          const okBtn = wrapper.find('.OkBtn_test')
          okBtn.vm.$emit('click')
          await wrapper.vm.$nextTick()
        })

        it('updates trail on server', async () => {
          expect(store.modules.editor.actions.updateTrail).toHaveBeenCalled()
        })

        it('creates a new station on server with "newStationId"', () => {
          expect(store.modules.editor.actions.createStation).toHaveBeenCalledWith(
            expect.any(Object),
            {
              trailId,
              stationId: newStationId
            }
          )
        })
      })

      afterAll(jest.clearAllMocks)
    })

    describe('When TrailGraph emits "removeStation" with { updatedGraph, removedStationId }', () => {
      const removedStationId = 'stationId'
      const updatedGraph = trail.graph
      beforeAll(async () => {
        trailGraph.vm.$emit('removeStation', { updatedGraph, removedStationId })
        await wrapper.vm.$nextTick()
      })

      it('opens a dialog', () => {
        expect(wrapper.vm.dialog.open).toBe(true)
      })

      it('waits for user validation for removing station on server', async () => {
        expect(store.modules.editor.actions.removeStationInTrail).not.toHaveBeenCalled()
      })

      describe('when user click on "OK"', () => {
        beforeAll(async () => {
          const okBtn = wrapper.find('.OkBtn_test')
          okBtn.vm.$emit('click')
          await wrapper.vm.$nextTick()
        })

        it('removes station on server', () => {
          expect(store.modules.editor.actions.removeStationInTrail).toHaveBeenCalledWith(
            expect.any(Object),
            {
              trailId,
              removedStationId,
              updatedGraph
            }
          )
        })
      })

      afterAll(jest.clearAllMocks)
    })
  })

  describe('QrCodesGenerator', () => {
    let qrCodes
    beforeAll(() => { qrCodes = wrapper.find('.QrCodesGenerator_test') })

    describe('when "QrCodesGenerator" emits "update:width"', () => {
      it('updates local pdfData.width', async () => {
        const newWidth = 1000
        qrCodes.vm.$emit('update:width', newWidth)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.pdfData.width).toEqual(newWidth)
      })
    })

    describe('when "QrCodesGenerator" emits "update:light"', () => {
      it('updates local pdfData.colors.light', async () => {
        const newLight = '#222222'
        qrCodes.vm.$emit('update:light', newLight)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.pdfData.colors.light).toEqual(newLight)
      })
    })

    describe('when "QrCodesGenerator" emits "update:dark"', () => {
      it('updates local pdfData.colors.dark', async () => {
        const newDark = '#DDDDDD'
        qrCodes.vm.$emit('update:dark', newDark)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.pdfData.colors.dark).toEqual(newDark)
      })
    })
  })

  describe('when destroyed', () => {
    it('updates mapData on server', async () => {
      const newMapData = { zoom: 25 }
      wrapper.vm.mapData = newMapData
      wrapper.destroy()
      await wrapper.vm.$nextTick()
      expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          newProps: { mapData: newMapData }
        }
      )
    })
  })
})
