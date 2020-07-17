import { mountQuasar } from '@test'
import StationRenderer from './StationRenderer'

const trailName = 'testTrail'
const stationName = 'testStation'
const rows = [
  {
    type: 'text',
    rawHtml: 'testText'
  },
  {
    type: 'image',
    url: 'testSrc'
  }
]

function nbRowsOfType (type) {
  const filteredRows = rows.filter(row => row.type === type)
  return filteredRows.length
}

const wrapper = mountQuasar(StationRenderer, {
  propsData: { trailName, stationName, rows }
})

describe('StationRenderer', () => {
  it('displays as many "StationImage" components as rows with type "image" in station', () => {
    const stationTexts = wrapper.findAll('.StationImage_test')
    expect(stationTexts.length).toBe(nbRowsOfType('image'))
  })

  it('displays as many "StationText" components as rows with type "text" in station', () => {
    const stationTexts = wrapper.findAll('.StationText_test')
    expect(stationTexts.length).toBe(nbRowsOfType('text'))
  })
})
