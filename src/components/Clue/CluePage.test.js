import { mountQuasar } from '@test'
import CluePage from './CluePage'

describe('CluePage', () => {
  const wrapper = mountQuasar(CluePage, {
    slots: {
      clue: '<span class="testClue">CLUE</span>',
      chaseInfo: '<span class="testChaseInfo">CHASE INFO</span>'
    }
  })

  function setProps (props, done) {
    wrapper.setProps(props)
    wrapper.vm.$nextTick(() => {
      done()
    })
  }

  describe('when "playerIsChasing" prop is true', () => {
    beforeAll(done => {
      setProps({
        playerIsChasing: true
      }, done)
    })

    it('displays clue slot', () => {
      const clue = wrapper.find('.testClue')
      expect(clue.exists()).toBeTruthy()
    })

    it('does not display chaseInfo slot', () => {
      const chaseInfo = wrapper.find('.testChaseInfo')
      expect(chaseInfo.exists()).toBeFalsy()
    })

    describe('when "isChaseEntry" prop is true', () => {
      beforeAll(done => {
        setProps({
          isChaseEntry: true
        }, done)
      })

      it('does not display a "StartChase" component', () => {
        const startChase = wrapper.findComponent({ name: 'StartChase' })
        expect(startChase.exists()).toBeFalsy()
      })
    })
  })

  describe('when "playerIsChasing" prop is false', () => {
    beforeAll(done => {
      setProps({
        playerIsChasing: false
      }, done)
    })

    it('does not display clue slot', () => {
      const clue = wrapper.find('.testClue')
      expect(clue.exists()).toBeFalsy()
    })

    it('displays chaseInfo slot', () => {
      const chaseInfo = wrapper.find('.testChaseInfo')
      expect(chaseInfo.exists()).toBeTruthy()
    })

    describe('when "isChaseEntry" prop is true', () => {
      beforeAll(done => {
        setProps({
          isChaseEntry: true
        }, done)
      })

      it('displays a "StartChase" component', () => {
        const startChase = wrapper.findComponent({ name: 'StartChase' })
        expect(startChase.exists()).toBeTruthy()
      })
    })
  })
})
