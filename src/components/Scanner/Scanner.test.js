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
    describe('checkQRCode', () => {
      const checkQRCode = wrapper.vm.checkQRCode
      it('returns true if code is not empty', () => {
        expect(checkQRCode('notEmpty')).toBeTruthy()
      })
      it('returns false if code is empty', () => {
        expect(checkQRCode('')).toBeFalsy()
      })
    })

    describe('parseChaseID', () => {
      const parseChaseID = wrapper.vm.parseChaseID
      it('returns the chaseID', () => {
        expect(parseChaseID('chaseID:clueID')).toBe('chaseID')
      })
    })

    describe('parseClueID', () => {
      const parseClueID = wrapper.vm.parseClueID
      it('returns the clueID', () => {
        expect(parseClueID('chaseID:clueID')).toBe('clueID')
      })
    })

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
