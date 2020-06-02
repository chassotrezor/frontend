import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import * as All from 'quasar'
import CluePage from './CluePage'

const { Quasar } = All

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})

describe('CluePage', () => {
  const localVue = createLocalVue()
  localVue.use(Quasar, { components })

  const wrapper = mount(CluePage, {
    localVue
  })

  it('exists', () => {
    expect(wrapper.exists).toBeTruthy()
  })
})
