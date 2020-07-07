import { mountQuasar } from '@test'
import TrailEditor from './TrailEditor'
import types from 'src/types'

const trailId = 'testTrailId'

const trail = {
  nodes: {
    testnodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION
    }
  },
  name: 'testTrailName'
}

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

  describe('when "update" button emits "click"', () => {
    beforeAll(done => {
      wrapper.vm.name = 'newName'
      const btn = wrapper.find('.UpdateBtn_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('updates the name of this trail on server', () => {
      expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          newProps: {
            name: 'newName'
          }
        }
      )
    })
  })

  describe('When TrailGraph emits "editStation" with value stationId', () => {
    const stationId = 'stationId'
    beforeAll(async () => {
      const trailGraph = wrapper.find('.TrailGraph_test')
      trailGraph.vm.$emit('editStation', stationId)
      await wrapper.vm.$nextTick()
    })

    it('emits "editStation" with value stationId', () => {
      expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
    })
  })
})
