import { mountQuasar } from '@test'
import TrailsList from './TrailsList'

const testTrails = {
  testTrailId1: {
    id: 'testTrailId1',
    name: 'testName1'
  },
  testTrailId2: {
    id: 'testTrailId2',
    name: 'testName2'
  }
}

const newTrailId = 'newTrailId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        myTrails: () => testTrails
      },
      actions: {
        createTrail: jest.fn().mockResolvedValue(newTrailId)
      }
    }
  }
}
describe('TrailsList', () => {
  let wrapper

  beforeAll(done => {
    wrapper = mountQuasar(TrailsList, {
      store
    })
    wrapper.vm.$nextTick(done)
  })

  it('displays a "TrailCard" component for each trail I created', () => {
    const myTrails = wrapper.findAll('.TrailCard_test')
    expect(myTrails.length).toBe(Object.keys(testTrails).length)
  })

  describe('when "TrailCard" component emits "edit"', () => {
    beforeAll(done => {
      const editTrail = wrapper.find('.TrailCard_test')
      editTrail.vm.$emit('edit')
      wrapper.vm.$nextTick(done)
    })

    it('emits "editTrail" event with "trailId" parameter', () => {
      expect(wrapper.emitted().editTrail[0][0]).toBe(testTrails.testTrailId1.id)
    })
  })

  it('displays a "create trail" button', () => {
    const btn = wrapper.find('.CreateTrail_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "create trail" button emits "click"', () => {
    beforeAll(done => {
      const btn = wrapper.find('.CreateTrail_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('creates a new trail on the server', () => {
      expect(store.modules.editor.actions.createTrail).toHaveBeenCalled()
    })

    it('emits "editTrail" event with value "newTrailId"', () => {
      expect(wrapper.emitted().editTrail[1][0]).toBe(newTrailId)
    })
  })
})
