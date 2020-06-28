import { mountQuasar } from '@test'
import QrCodesGenerator from './QrCodesGenerator'

jest.mock('html2pdf.js', () => jest.fn())
import html2pdf from 'html2pdf.js'

const chaseId = 'testChaseId'
const chaseName = 'testChaseName'
const chaseScheme = {
  testClueId1: {
    id: 'testClueId1',
    name: 'testClueName1'
  },
  testClueId2: {
    id: 'testClueId2',
    name: 'testClueName2'
  }
}

describe('QrCodesGenerator', () => {
  const wrapper = mountQuasar(QrCodesGenerator, {
    propsData: {
      chaseName,
      chaseId,
      chaseScheme
    }
  })

  const modules = wrapper.findAll('.QrCodeModule_test')
  const expectedLength = Object.keys(chaseScheme).length

  it('displays a QR Code Module for each clue in chaseScheme', () => {
    expect(modules.length).toBe(expectedLength)
  })

  test('every QR Code Module ends with a page break', () => {
    for (let i = 0; i < expectedLength; i++) {
      expect(modules.at(i).attributes().style).toContain('page-break-after: always')
    }
  })

  it('creates a pdf when QBtn emits "click"', async () => {
    const btn = wrapper.find('.QBtn_test')
    btn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(html2pdf).toHaveBeenCalled()
  })
})
