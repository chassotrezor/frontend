import { mountQuasar } from '@test'
import StationImage from './StationImage'

const src = 'sourceImage'
const wrapper = mountQuasar(StationImage, {
  propsData: {
    src
  }
})

describe('StationImage', () => {
  it('displays a "QImg" with "src" prop as source', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.props().src).toBe(src)
  })
})
