import { mountQuasar } from '@test'
import RowImage from './RowImage'

const row = {
  rowId: 'rowId',
  data: {
    url: 'sourceImage'
  }
}
const wrapper = mountQuasar(RowImage, {
  propsData: {
    row
  }
})

describe('RowImage', () => {
  it('displays a "QImg" with "src" prop as source', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.attributes().src).toBe(row.data.url)
  })
})
