import { mountQuasar } from '@test'
import Scanner from './Scanner'

describe('Scanner', () => {
  const wrapper = mountQuasar(Scanner, {
    mocks: {
      $router: {
        push: jest.fn()
      }
    }
  })
  it('contains a qrcode-stream component', () => {
    const QRCodeStream = wrapper.findComponent({ name: 'QrcodeStream' })
    expect(QRCodeStream.exists()).toBeTruthy()
  })

  describe('methods', () => {
    describe('onDecode', () => {
      const push = wrapper.vm.$router.push
      beforeEach(() => {
        push.mockClear()
      })

      const onDecode = wrapper.vm.onDecode
      it('pushes to clue when code is valid', () => {
        onDecode('testChase:testClue')
        expect(push).toHaveBeenCalledWith({
          name: 'clue',
          params: {
            chaseID: 'testChase',
            clueID: 'testClue'
          }
        })
      })
      it('does nothing if code is invalid', () => {
        onDecode('')
        expect(push).not.toHaveBeenCalled()
      })
    })
  })
})
