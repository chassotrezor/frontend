import { mountQuasar } from '@test'
import CluePage from './CluePage'

describe('CluePage', () => {
  const wrapper = mountQuasar(CluePage, {
    slots: {
      clue: '<span class="testClue">CLUE</span>',
      chaseInfo: '<span class="testChaseInfo">CHASE INFO</span>'
    }
  })

  describe('when "playerIsChasing" prop is true', () => {
    beforeAll(done => {
      wrapper.setProps({
        playerIsChasing: true
      })
      wrapper.vm.$nextTick(() => {
        done()
      })
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
        wrapper.setProps({
          isChaseEntry: true
        })
        wrapper.vm.$nextTick(() => {
          done()
        })
      })

      it('does not display a "JoinChase" component', () => {
        const joinChase = wrapper.findComponent({ name: 'JoinChase' })
        expect(joinChase.exists()).toBeFalsy()
      })
    })
  })

  describe('when "playerIsChasing" prop is false', () => {
    beforeAll(done => {
      wrapper.setProps({
        playerIsChasing: false
      })
      wrapper.vm.$nextTick(() => {
        done()
      })
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
        wrapper.setProps({
          isChaseEntry: true
        })
        wrapper.vm.$nextTick(() => {
          done()
        })
      })

      it('displays a "JoinChase" component', () => {
        const joinChase = wrapper.findComponent({ name: 'JoinChase' })
        expect(joinChase.exists()).toBeTruthy()
      })
    })
  })
})
