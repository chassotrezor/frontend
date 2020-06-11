import { mountQuasar } from '@test'
import ClueImage from './ClueImage'

const src = 'sourceImage'
const wrapper = mountQuasar(ClueImage, {
  propsData: {
    src
  }
})

describe('ClueImage', () => {
  it('displays a "QImg" with "src" prop as source', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.props().src).toBe(src)
  })
})
