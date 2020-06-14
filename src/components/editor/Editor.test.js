import { mountQuasar } from '@test'
import Editor from './Editor'

describe('Editor', () => {
  const wrapper = mountQuasar(Editor)

  it('displays a "MyChases" component', () => {
    const myChases = wrapper.find('.MyChases_test')
    expect(myChases.exists()).toBe(true)
  })
})
