import { mountQuasar } from '@test'
import StationImage from './StationImage'

const row = {
  rowId: 'rowId',
  data: {
    url: 'sourceImage'
  }
}
const wrapper = mountQuasar(StationImage, {
  propsData: {
    row
  }
})

describe('StationImage', () => {
  it('displays a "QImg" with "src" prop as source', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.attributes().src).toBe(row.data.url)
  })
})
