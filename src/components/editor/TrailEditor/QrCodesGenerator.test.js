/*
  TODO: find why "async > ...$emit(...) > await wrapper.vm.$nextTick()" does not work here
*/

import { mountQuasar } from '@test'
import QrCodesGenerator from './QrCodesGenerator'
import types from 'src/types'

const mockSave = jest.fn()
jest.mock('jspdf', () => {
  return class JsPDF {
    // constructor () {}
    addImage () {}
    extractImageFromDataUrl () { return 'image' }
    insertPage () {}
    output () { return 'pdf' }
    save = mockSave
    setFontSize () {}
    setFontStyle () {}
    setPage () {}
    text () {}
  }
})

jest.mock('vue-pdf', () => {
  return {
    name: 'VuePdf'
  }
})

const trailId = 'testTrailId'
const trailName = 'testTrailName'
const graph = {
  endNodes: ['testStationId2'],
  nodes: {
    testStationId1: {
      dependencies: [],
      name: 'testStationName1',
      type: types.nodes.STATION,
      position: { Ac: 1, Rc: 1 }
    },
    testStationId2: {
      dependencies: ['testStationId1'],
      name: 'testStationName2',
      type: types.nodes.STATION,
      position: { Ac: 2, Rc: 2 }
    }
  }
}
const pdfData = {
  colors: {
    light: '#FFFFFF',
    dark: '#000000'
  },
  width: 100
}

const $q = {
  notify: jest.fn()
}

describe('QrCodesGenerator', () => {
  let wrapper
  beforeAll(() => {
    wrapper = mountQuasar(QrCodesGenerator, {
      propsData: {
        trailName,
        trailId,
        graph,
        pdfData
      },
      mocks: { $q }
    })
  })

  describe('when "PdfNavigationNext" emits "click"', () => {
    it('increases page number', () => {
      const next = wrapper.find('.PdfNavigationNext_test')
      next.vm.$emit('click')
      expect(wrapper.vm.page).toBe(2)
    })
  })

  describe('when "PdfNavigationPrevious" emits "click"', () => {
    it('decreases page number', () => {
      const next = wrapper.find('.PdfNavigationPrevious_test')
      next.vm.$emit('click')
      expect(wrapper.vm.page).toBe(1)
    })
  })

  it('displays a "PdfViewer" with page="page" and src="pdf" props', () => {
    const pdf = wrapper.find('.PdfViewer_test')
    expect(pdf.attributes().src).toBe('pdf')
    expect(pdf.attributes().page).toBe('1')
  })

  describe('when "DownloadCodes" button emits "click"', () => {
    it('creates a pdf to save', () => {
      const btn = wrapper.find('.DownloadCodes_test')
      btn.vm.$emit('click')
      expect(mockSave).toHaveBeenCalled()
    })
  })

  describe('when "WidthInput" emits "change"', () => {
    it('emits "update:width" with new width', () => {
      const newWidth = 2000
      const input = wrapper.find('.WidthInput_test')
      input.vm.$emit('change', newWidth)
      expect(wrapper.emitted('update:width')[0][0]).toBe(newWidth)
    })
  })

  describe('when "LightColor" emits "change"', () => {
    describe('if contrast between light and dark is not valid', () => {
      const newLight = '#000000'
      beforeAll(() => {
        const input = wrapper.find('.LightColorInput_test')
        input.vm.$emit('input', newLight)
        input.vm.$emit('change', newLight)
      })

      it('notifies user', () => {
        expect($q.notify).toHaveBeenCalled()
      })

      it('restores current "colors.light" value', () => {
        expect(wrapper.vm.colors.light).toBe(pdfData.colors.light)
      })

      afterAll(jest.clearAllMocks)
    })

    describe('if contrast between light and dark is valid', () => {
      const newLight = '#EEEEEE'
      beforeAll(() => {
        const input = wrapper.find('.LightColorInput_test')
        input.vm.$emit('input', newLight)
        input.vm.$emit('change', newLight)
      })

      it('emits "update:light" with new color', () => {
        const input = wrapper.find('.LightColorInput_test')
        input.vm.$emit('change', newLight)
        expect(wrapper.emitted('update:light')[0][0]).toBe(newLight)
      })
    })
  })

  describe('when "DarkColor" emits "change"', () => {
    describe('if contrast between light and dark is not valid', () => {
      const newDark = '#FFFFFF'
      beforeAll(() => {
        const input = wrapper.find('.DarkColorInput_test')
        input.vm.$emit('input', newDark)
        input.vm.$emit('change', newDark)
      })

      it('notifies user', () => {
        expect($q.notify).toHaveBeenCalled()
      })

      it('restores current "colors.light" value', () => {
        expect(wrapper.vm.colors.dark).toBe(pdfData.colors.dark)
      })

      afterAll($q.notify.mockClear)
    })

    describe('if contrast between light and dark is valid', () => {
      const newDark = '#111111'
      beforeAll(() => {
        const input = wrapper.find('.DarkColorInput_test')
        input.vm.$emit('input', newDark)
        input.vm.$emit('change', newDark)
      })

      it('emits "update:dark" with new color', () => {
        const input = wrapper.find('.DarkColorInput_test')
        input.vm.$emit('change', newDark)
        expect(wrapper.emitted('update:dark')[0][0]).toBe(newDark)
      })
    })
  })
})
