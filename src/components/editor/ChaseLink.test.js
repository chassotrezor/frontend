import { mountQuasar } from '@test'
import ChaseLink from './ChaseLink'

const chaseId = 'testChaseId'

describe('ChaseLink', () => {
  const wrapper = mountQuasar(ChaseLink, {
    propsData: {
      chaseId
    }
  })

  it('emits "open" event with "chaseId" value when clicked', () => {
    wrapper.trigger('click')
    expect(wrapper.emitted('open')[0][0]).toBe(chaseId)
  })
})
