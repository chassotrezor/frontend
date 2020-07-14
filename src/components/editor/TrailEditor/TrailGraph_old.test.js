import { mountQuasar } from '@test'
import TrailGraph from './TrailGraph'
import types from 'src/types'

const trailId = 'testTrailId'

const trail = {
  trailEntries: ['testNodeId1'],

  nodes: {
    testNodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION,
      dependencies: []
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION,
      dependencies: ['testNodeId1']
    },
    testNodeId3: {
      name: 'testStationName3',
      type: types.nodes.STATION,
      dependencies: ['testNodeId2']
    },
    testNodeId4: {
      name: 'testStationName4',
      type: types.nodes.STATION,
      dependencies: ['testNodeId3']
    }
  },

  endNodes: ['testNodeId4']
}

const expectedNodeIdsInOrder = [
  'testNodeId1',
  'testNodeId2',
  'testNodeId3',
  'testNodeId4'
]

const nbNodes = expectedNodeIdsInOrder.length

const newStationId = 'newStationId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail
      },
      actions: {
        createStation: jest.fn().mockResolvedValue(newStationId),
        deleteNodeInTrail: jest.fn(),
        updateTrail: jest.fn()
      }
    }
  }
}

describe('TrailGraph', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(TrailGraph, {
      store,
      propsData: {
        trailId
      }
    })
    wrapper.vm.$nextTick(done)
  })

  describe('NodeCards', () => {
    let nodeCards
    beforeAll(() => {
      nodeCards = wrapper.findAll('.NodeCard_test')
    })

    it('displays a "NodeCard" component for each node in trail', () => {
      expect(nodeCards.length).toBe(Object.keys(trail.nodes).length)
    })

    test('"NodeCards" are displayed as a list, according to dependencies', () => {
      const nodeIdsInOrder = []
      for (let i = 0; i < nodeCards.length; i++) {
        nodeIdsInOrder.push(nodeCards.at(i).props().node.nodeId)
      }
      expect(nodeIdsInOrder).toEqual(expectedNodeIdsInOrder)
    })

    test('only first "NodeCard" has prop "first" set to true', () => {
      for (let i = 0; i < nbNodes; i++) {
        expect(nodeCards.at(i).vm.first).toBe(i === 0)
      }
    })

    test('only last "NodeCard" has prop "last" set to true', () => {
      for (let i = 0; i < nbNodes; i++) {
        expect(nodeCards.at(i).vm.last).toBe(i === nbNodes - 1)
      }
    })

    describe('when one "NodeCard" component emits "editStation"', () => {
      beforeAll(async () => {
        const nodeCard = nodeCards.at(0)
        nodeCard.vm.$emit('editStation')
        await wrapper.vm.$nextTick()
      })

      it('emits "editStation" event with value "stationId"', () => {
        const stationId = expectedNodeIdsInOrder[0]
        expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
      })
    })

    describe('when one "NodeCard" component emits "remove"', () => {
      beforeAll(async () => {
        const nodeCard = nodeCards.at(0)
        nodeCard.vm.$emit('remove')
        await wrapper.vm.$nextTick()
      })

      it('it deletes corresponding node in correspondig trail on server', () => {
        const nodeId = expectedNodeIdsInOrder[0]
        expect(store.modules.editor.actions.deleteNodeInTrail).toHaveBeenCalledWith(
          expect.any(Object),
          {
            trailId,
            nodeId
          }
        )
      })
    })

    describe('when one "NodeCard" component emits "up"', () => {
      describe('if first and last nodes ar not affected', () => {
        beforeAll(async () => {
          const nodeCard = nodeCards.at(2)
          nodeCard.vm.$emit('up')
          await wrapper.vm.$nextTick()
        })

        it('updates trail on server with corrected "nodes" and unaffected "endNodes" and "trailEntries"', () => {
          expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
            expect.any(Object),
            {
              trailId,
              newProps: {
                nodes: {
                  testNodeId1: {
                    name: 'testStationName1',
                    type: types.nodes.STATION,
                    dependencies: []
                  },
                  testNodeId2: {
                    name: 'testStationName2',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId3']
                  },
                  testNodeId3: {
                    name: 'testStationName3',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId1']
                  },
                  testNodeId4: {
                    name: 'testStationName4',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId2']
                  }
                },
                endNodes: trail.endNodes,
                trailEntries: trail.trailEntries
              }
            })
        })

        afterAll(() => {
          store.modules.editor.actions.updateTrail.mockReset()
        })
      })

      describe('if first node is affected', () => {
        beforeAll(async () => {
          const nodeCard = nodeCards.at(1)
          nodeCard.vm.$emit('up')
          await wrapper.vm.$nextTick()
        })

        it('updates trail on server with corrected "nodes" and "trailEntries" and unaffected "endNodes"', () => {
          expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
            expect.any(Object),
            {
              trailId,
              newProps: {
                nodes: {
                  testNodeId1: {
                    name: 'testStationName1',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId2']
                  },
                  testNodeId2: {
                    name: 'testStationName2',
                    type: types.nodes.STATION,
                    dependencies: []
                  },
                  testNodeId3: {
                    name: 'testStationName3',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId1']
                  },
                  testNodeId4: {
                    name: 'testStationName4',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId3']
                  }
                },
                endNodes: trail.endNodes,
                trailEntries: ['testNodeId2']
              }
            })
        })

        afterAll(() => {
          store.modules.editor.actions.updateTrail.mockReset()
        })
      })

      describe('if last node is affected', () => {
        beforeAll(async () => {
          const nodeCard = nodeCards.at(nbNodes - 1)
          nodeCard.vm.$emit('up')
          await wrapper.vm.$nextTick()
        })

        it('updates trail on server with corrected "nodes" and "trailEntries" and unaffected "endNodes"', () => {
          expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
            expect.any(Object),
            {
              trailId,
              newProps: {
                nodes: {
                  testNodeId1: {
                    name: 'testStationName1',
                    type: types.nodes.STATION,
                    dependencies: []
                  },
                  testNodeId2: {
                    name: 'testStationName2',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId1']
                  },
                  testNodeId3: {
                    name: 'testStationName3',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId4']
                  },
                  testNodeId4: {
                    name: 'testStationName4',
                    type: types.nodes.STATION,
                    dependencies: ['testNodeId2']
                  }
                },
                endNodes: ['testNodeId3'],
                trailEntries: trail.trailEntries
              }
            })
        })

        afterAll(() => {
          store.modules.editor.actions.updateTrail.mockReset()
        })
      })
    })

    describe('when one "NodeCard" component emits "down"', () => {
      let up
      beforeAll(async () => {
        up = jest.spyOn(wrapper.vm, 'up')
        const nodeCard = nodeCards.at(0)
        nodeCard.vm.$emit('down')
        await wrapper.vm.$nextTick()
      })

      it('calls "up" method with index + 1', () => {
        expect(up).toHaveBeenCalledWith(1)
      })

      afterAll(() => {
        up.mockRestore()
      })
    })
  })

  it('displays a "create station" button', () => {
    const btn = wrapper.find('.CreateStation_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "create station" button emits "click"', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.CreateStation_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('creates a new station for this trail on server', () => {
      expect(store.modules.editor.actions.createStation).toHaveBeenCalledWith(
        expect.any(Object),
        { trailId }
      )
    })

    it('emits "editStation" with "newStationId" value', () => {
      expect(wrapper.emitted('editStation')[1][0]).toBe(newStationId)
    })
  })
})
