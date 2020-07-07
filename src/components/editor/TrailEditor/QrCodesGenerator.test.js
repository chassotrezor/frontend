import { mountQuasar } from '@test'
import QrCodesGenerator from './QrCodesGenerator'
import types from 'src/types'

jest.mock('html2pdf.js', () => jest.fn())
import html2pdf from 'html2pdf.js'

const trailId = 'testTrailId'
const trailName = 'testTrailName'
const trailNodes = {
  testStationId1: {
    dependancies: [],
    name: 'testStationName1',
    type: types.nodes.STATION
  },
  testStationId2: {
    dependancies: ['testStationId1'],
    name: 'testStationName2',
    type: types.nodes.STATION
  }
}

describe('QrCodesGenerator', () => {
  const wrapper = mountQuasar(QrCodesGenerator, {
    propsData: {
      trailName,
      trailId,
      trailNodes
    }
  })

  const modules = wrapper.findAll('.QrCodeModule_test')
  const expectedLength = Object.keys(trailNodes).length

  it('displays a QR Code Module for each station in nodes', () => {
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
