import { mountQuasar } from '@test'
import TrailEditor from './TrailEditor'
import types from 'src/types'

jest.mock('html2pdf.js', () => {})

const trailId = 'testTrailId'

const trail = {
  nodes: {
    testnodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION,
      dependencies: []
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION,
      dependencies: ['testnodeId1']
    }
  },
  name: 'testTrailName',
  endNodes: ['testNodeId2']
}
const testNodeId3 = {
  type: types.nodes.STATION,
  name: 'testNodeName3',
  dependencies: ['testNodeId2']
}
const expectedNodes = {
  ...trail.nodes,
  testNodeId3
}
const expectedEndNodes = ['testNodeId3']
const expectedName = 'newName'

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail
      },
      actions: {
        updateTrail: jest.fn()
      }
    }
  }
}

describe('TrailEditor', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(TrailEditor, {
      store,
      propsData: {
        trailId
      }
    })
    wrapper.vm.$nextTick(done)
  })

  it('displays an "update" button', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  describe('TrailGraph', () => {
    let trailGraph
    beforeAll(() => { trailGraph = wrapper.find('.TrailGraph_test') })

    describe('when "TrailGraph" emits "update" with value { nodes, endNodes }', () => {
      beforeAll(async () => {
        trailGraph.vm.$emit('update', {
          nodes: expectedNodes,
          endNodes: expectedEndNodes
        })
        await wrapper.vm.$nextTick()
      })

      it('sets its "nodes" and "endNodes" data to thes values', () => {
        expect(wrapper.vm.nodes).toEqual(expectedNodes)
        expect(wrapper.vm.endNodes).toEqual(expectedEndNodes)
      })
    })

    describe('When TrailGraph emits "editStation" with value stationId', () => {
      const stationId = 'stationId'
      beforeAll(async () => {
        trailGraph.vm.$emit('editStation', stationId)
        await wrapper.vm.$nextTick()
      })

      it('emits "editStation" with value stationId', () => {
        expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
      })
    })
  })

  describe('when "update" button emits "click"', () => {
    beforeAll(done => {
      wrapper.vm.name = expectedName
      const btn = wrapper.find('.UpdateBtn_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('updates the name, nodes and endNodes of this trail on server', () => {
      expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          newProps: {
            nodes: expectedNodes,
            endNodes: expectedEndNodes,
            name: expectedName
          }
        }
      )
    })
  })
})
