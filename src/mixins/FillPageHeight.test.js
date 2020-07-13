import { mountMixin } from '@test'
import FillPageHeight from './FillPageHeight'

/*
TODO: rework tests using the following (and extract it to mock this mixin in dependent components)

const testInnerHeight = 120
const testFooterHeaderHeight = 10

global.window.innerHeight = testInnerHeight

global.document.getElementsByClassName = className => {
  if (className === 'q-header' || className === 'q-footer') {
    return {
      item: i => {
        return { scrollHeight: testFooterHeaderHeight }
      }
    }
  } else return global.document.getElementsByClassName
}

global.window.addEventListener = ...
*/

const layoutHeaderHeight = () => 10
const layoutFooterHeight = () => 10
const windowInnerHeight = () => 100
const startListeningToResize = jest.spyOn(window, 'addEventListener')
const stopListeningToResize = jest.spyOn(window, 'removeEventListener')

const mockedFPH = {
  ...FillPageHeight,
  computed: {
    ...FillPageHeight.computed,
    layoutHeaderHeight,
    layoutFooterHeight,
    windowInnerHeight
  }
}

let wrapper

describe('FillPageHeight mixin', () => {
  beforeAll(async () => {
    wrapper = mountMixin(mockedFPH)
    await wrapper.vm.$nextTick()
  })

  describe('when mounted', () => {
    it('initializes pageHeight to "window.innerHeight - layout header - layout footer"', () => {
      expect(wrapper.vm.pageHeight).toBe(80)
    })

    it('adds a resize event listener that triggers "setPageHeight"', () => {
      expect(startListeningToResize).toHaveBeenLastCalledWith('resize', wrapper.vm.setPageHeight)
    })
  })

  describe('when destroyed', () => {
    beforeAll(async () => {
      wrapper.destroy()
      await wrapper.vm.$nextTick()
    })

    it('removes the resize event listener that triggers "setPageHeight"', () => {
      expect(stopListeningToResize).toHaveBeenLastCalledWith('resize', wrapper.vm.setPageHeight)
    })
  })
})
