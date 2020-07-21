import { mountQuasar } from '@test'
import StationsListDrawerContent from './StationsListDrawerContent'

const sortedAccessibleTrails = [
  {
    trailId: 'testTrailId1',
    name: 'trailName1',
    display: true,
    color: '#000001'
  },
  {
    trailId: 'testTrailId2',
    name: 'trailName2',
    display: true,
    color: '#000002'
  },
  {
    trailId: 'testTrailId3',
    name: 'trailName3',
    display: false,
    color: '#000003'
  }
]

const store = {
  modules: {
    user: {
      namespaced: true,
      actions: {
        toggleTrailDisplay: jest.fn(),
        setTrailColor: jest.fn()
      },
      getters: {
        sortedAccessibleTrails: () => sortedAccessibleTrails
      }
    }
  }
}

describe('StationsListDrawerContent', () => {
  let wrapper
  let items
  beforeAll(async () => {
    wrapper = mountQuasar(StationsListDrawerContent, {
      store
    })
    await wrapper.vm.$nextTick()
    items = wrapper.findAll('.QItem_test')
  })

  it('lists all the accessible trails', () => {
    expect(items.length).toBe(sortedAccessibleTrails.length)
  })

  describe('every trail is displayed as an item containing...', () => {
    test('trail name', () => {
      for (let i = 0; i < sortedAccessibleTrails.length; i++) {
        expect(items.at(i).html()).toContain(sortedAccessibleTrails[i].name)
      }
    })

    test('"toggle display" button in state according to trail.display', () => {
      for (let i = 0; i < sortedAccessibleTrails.length; i++) {
        const toggle = items.at(i).find('.ToggleDisplay_test')
        expect(toggle.vm.value).toBe(sortedAccessibleTrails[i].display)
      }
    })

    test('"pick color" button', () => {
      for (let i = 0; i < sortedAccessibleTrails.length; i++) {
        const picker = items.at(i).find('.PickColor_test')
        expect(picker.exists()).toBe(true)
      }
    })
  })

  describe('when "toggle display" emits "input"', () => {
    beforeAll(async () => {
      const toggle = items.at(0).find('.ToggleDisplay_test')
      toggle.vm.$emit('input')
      await wrapper.vm.$nextTick()
    })

    it('toggles display value on server', () => {
      expect(store.modules.user.actions.toggleTrailDisplay).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId: sortedAccessibleTrails[0].trailId

        }
      )
    })
  })

  describe('when "pick color" emits "click"', () => {
    beforeAll(async () => {
      const pick = items.at(0).find('.PickColor_test')
      pick.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('opens a "q-dialog" with a "q-color"', () => {
      expect(wrapper.vm.chooseColor).toBe(true)
    })

    describe('when "q-color" emits "input"', () => {
      const newColor = '#000004'
      beforeAll(async () => {
        const picker = wrapper.find('.ColorPicker_test')
        picker.vm.$emit('input', newColor)
        await wrapper.vm.$nextTick()
      })

      it('closes "q-dialog"', () => {
        expect(wrapper.vm.chooseColor).toBe(false)
      })

      it('updates trail color on server', () => {
        expect(store.modules.user.actions.setTrailColor).toHaveBeenCalledWith(
          expect.any(Object),
          {
            trailId: sortedAccessibleTrails[0].trailId,
            color: newColor
          }
        )
      })
    })
  })
})
