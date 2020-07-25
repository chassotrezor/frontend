import { mountQuasar } from '@test'
import TextRowEditor from './TextRowEditor'

describe('TextRowEditor', () => {
  const wrapper = mountQuasar(TextRowEditor, {
    propsData: {
      row: {
        data: { rawHtml: '<div>TEST</div>' }
      }
    },
    mocks: {
      $sanitize: () => '<div>Sanitized</div>'
    }
  })

  const editor = wrapper.find('.QEditor_test')

  it('displays a Quasar WYSIWYG text editor', () => {
    expect(editor.exists()).toBe(true)
  })

  it('sanitizes text value before setting editor prop value', () => {
    expect(wrapper.vm.sanitizedText).toBe('<div>Sanitized</div>')
  })

  it('emits "input" with param "textValue" when text editor emits "input" with param "textValue"', async () => {
    const newRawHtml = '<div>New Text</div>'
    editor.vm.$emit('input', newRawHtml)
    await wrapper.vm.$nextTick()
    const expectedPayload = {
      data: {
        rawHtml: newRawHtml
      }
    }
    expect(wrapper.emitted().input[0][0]).toEqual(expectedPayload)
  })
})
