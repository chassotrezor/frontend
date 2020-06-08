import { mountQuasar } from '@test'
import ClueLayout from './ClueLayout'

describe('ClueLayout', () => {
  const wrapper = mountQuasar(ClueLayout)

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

    it('displays clue component', () => {
      const clue = wrapper.find('.Clue_test')
      expect(clue.exists()).toBeTruthy()
    })

    it('does not display chaseInfo slot', () => {
      const chaseInfo = wrapper.find('.ChaseInfo_test')
      expect(chaseInfo.exists()).toBeFalsy()
    })

    describe('when "isChaseEntry" prop is true', () => {
      beforeAll(done => {
        setProps({
          isChaseEntry: true
        }, done)
      })

      it('does not display a "StartChase" component', () => {
        const startChase = wrapper.find('.StartChase_test')
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

    it('does not display clue component', () => {
      const clue = wrapper.find('.Clue_test')
      expect(clue.exists()).toBeFalsy()
    })

    it('displays chaseInfo slot', () => {
      const chaseInfo = wrapper.find('.ChaseInfo_test')
      expect(chaseInfo.exists()).toBeTruthy()
    })

    describe('when "isChaseEntry" prop is true', () => {
      beforeAll(done => {
        setProps({
          isChaseEntry: true
        }, done)
      })

      it('displays a "StartChase" component', () => {
        const startChase = wrapper.find('.StartChase_test')
        expect(startChase.exists()).toBeTruthy()
      })
    })
  })
})
