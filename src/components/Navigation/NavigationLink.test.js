import { mountQuasar } from '@test'
import NavigationLink from './NavigationLink'

const defaultRoute = {
  name: 'defaultName',
  path: '/default/path'
}

const $router = {
  push: jest.fn()
}
const $route = defaultRoute

const wrapper = mountQuasar(NavigationLink, {
  propsData: {
    title: 'testTitle',
    route: defaultRoute
  },
  mocks: {
    $router,
    $route
  }
})

describe('NavigationLink', () => {
  const qItem = wrapper.findComponent({ name: 'QItem' })
  it('displays its title', () => {
    expect(qItem.find('testTiltle')).toBeTruthy()
  })

  describe('when "route" prop has same root path as current route', () => {
    beforeAll(async () => {
      wrapper.setProps({
        route: {
          ...defaultRoute,
          path: `/${$route.path.split('/')[1]}/and/more/path`
        }
      })
      await wrapper.vm.$nextTick()
    })

    test('q-item has "active_test" class', () => {
      expect(qItem.classes()).toContain('active_test')
    })

    test('q-item is not clickable', () => {
      expect(qItem.props().clickable).toBe(false)
    })

    test('router pushes to "route" prop when q-item emits "click" event', async () => {
      qItem.vm.$emit('click')
      await wrapper.vm.$nextTick()
      expect($router.push).toHaveBeenCalledWith(wrapper.props().route)
    })
  })

  describe('when "route" prop has different root path than current route', () => {
    beforeAll(done => {
      wrapper.setProps({
        route: {
          ...defaultRoute,
          path: '/other/route'
        }
      })
      wrapper.vm.$nextTick(done)
    })

    test('q-item has "inactive_test" class', () => {
      expect(qItem.classes()).toContain('inactive_test')
    })

    test('q-item is clickable', () => {
      expect(qItem.props().clickable).toBe(true)
    })
  })

  describe('when "icon" prop is set', () => {
    beforeAll(done => {
      wrapper.setProps({
        icon: 'iconName'
      })
      wrapper.vm.$nextTick(done)
    })
    it('displays an icon with "icon" name', () => {
      const qIcon = wrapper.findComponent({ name: 'QIcon' })
      expect(qIcon.props().name).toBe('iconName')
    })
  })
})
