import { mountQuasar } from '@test'
import NavigationLink from './NavigationLink'

describe('NavigationLink', () => {
  const $router = {
    push: jest.fn()
  }
  const $route = {
    name: 'currentRoute',
    params: {}
  }
  const wrapper = mountQuasar(NavigationLink, {
    propsData: {
      title: 'testTitle',
      route: {
        name: 'testRoute'
      }
    },
    mocks: {
      $router,
      $route
    }
  })
  const qItem = wrapper.findComponent({ name: 'QItem' })

  it('displays its title', () => {
    expect(qItem.find('testTiltle')).toBeTruthy()
  })

  describe('when "route" prop has same name as current route', () => {
    beforeAll(done => {
      wrapper.setProps({
        route: {
          name: $route.name
        }
      })
      wrapper.vm.$nextTick(done)
    })

    test('q-item has "active_test" class', () => {
      expect(qItem.classes()).toContain('active_test')
    })

    test('q-item is not clickable', () => {
      expect(qItem.props().clickable).toBe(false)
    })

    test('router pushes to "route" prop when q-item emits "click" event', () => {
      return new Promise(resolve => {
        qItem.vm.$emit('click')
        wrapper.vm.$nextTick(() => {
          expect($router.push).toHaveBeenCalledWith({ name: $route.name })
          resolve()
        })
      })
    })
  })

  describe('when "route" prop has different name than current route', () => {
    beforeAll(done => {
      wrapper.setProps({
        route: {
          name: 'differentName'
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
