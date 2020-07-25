import { mountQuasar } from '@test'
import ImageRowEditor from './ImageRowEditor'
import { cloneDeep } from 'lodash'

const $route = {
  params: {
    trailId: 'testTrailId',
    stationId: 'testStationId'
  }
}

const defaultRow = {
  data: {
    url: 'path/to/file',
    fileId: 'testFileId',
    width: 100
  },
  rowId: 'testRowId'
}

describe('ImageRowEditor', () => {
  const row = cloneDeep(defaultRow)
  const wrapper = mountQuasar(ImageRowEditor, {
    propsData: {
      row,
      oldRowData: row.data
    },
    mocks: {
      $route
    }
  })

  it('displays a "QImg" with "row.data.url" as "src" prop', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.props().src).toBe(defaultRow.data.url)
  })

  describe('width handler', () => {
    const handler = wrapper.find('.WidthHandler_test')
    it('displays a width handler', () => {
      expect(handler.exists()).toBe(true)
    })

    it('emits "input" with "newWidth" when "WidthHandler" emits "input"', async () => {
      const newWidth = 80
      handler.vm.$emit('input', newWidth)
      await wrapper.vm.$nextTick()

      const expectedPayload = {
        data: {
          width: newWidth
        }
      }
      expect(wrapper.emitted().input[0][0]).toEqual(expectedPayload)
      wrapper.vm.width = defaultRow.data.width
    })
  })

  describe('FirebaseUploader', () => {
    const fu = wrapper.find('.FirebaseUploader_test')

    test('its "path" prop is "trailId/stationId"', () => {
      const trailId = $route.params.trailId
      const stationId = $route.params.stationId
      const expectedPath = `${trailId}/${stationId}`
      expect(fu.props().path).toBe(expectedPath)
    })

    test('its "file-id" prop is "row.rowId"', () => {
      expect(fu.props().fileId).toBe(defaultRow.rowId)
    })

    describe('When FirebaseUploader emits "uploaded" with new "url" and "fileId"', () => {
      const newUrl = 'new/url'
      const newFileId = 'newFileId'

      beforeAll(async () => {
        fu.vm.$emit('uploaded', {
          url: newUrl,
          fileId: newFileId
        })
        await wrapper.vm.$nextTick()
      })

      test('"ImageRow" emits "input" with new "fileId" and "url"', () => {
        const expectedPayload = {
          data: {
            url: newUrl,
            fileId: newFileId
          }
        }
        expect(wrapper.emitted().input[1][0]).toEqual(expectedPayload)
      })

      test('"ImageRow" emits "triggerSave"', () => {
        expect(wrapper.emitted().triggerSave).toBeTruthy()
      })
    })
  })

  describe('Url input', () => {
    const url = wrapper.find('.UrlInput_test')
    describe('when "Url input" emits "input" with "handWrittenUrl"', () => {
      const newUrl = 'handWrittenUrl'
      beforeAll(async () => {
        url.vm.$emit('input', newUrl)
        const updatedRow = cloneDeep(row)
        row.data.url = newUrl
        row.data.fileId = null
        wrapper.setProps({ row: updatedRow })
        await wrapper.vm.$nextTick()
      })

      test('"ImageRow" emits "input" with new "url" and nulled "fileId"', () => {
        const expectedPayload = {
          data: {
            url: newUrl,
            fileId: null
          }
        }
        expect(wrapper.emitted().input[2][0]).toEqual(expectedPayload)
      })

      describe('when "oldRowData.fileId" is not null', () => {
        test('"ImageRow" displays no "FirebaseUploader" card', () => {
          const fu = wrapper.find('.FirebaseUploader_test')
          expect(fu.exists()).toBe(false)
        })

        test('"ImageRow" displays a "WarningDeleteImage" card', () => {
          const card = wrapper.find('.WarningDeleteImage_test')
          expect(card.exists()).toBe(true)
        })
      })

      describe('when "oldRowData.fileId" is null', () => {
        const rowWithNullFileId = cloneDeep(row)
        rowWithNullFileId.data.fileId = null
        const oldRowData = rowWithNullFileId.data

        beforeAll(async () => {
          wrapper.setProps({
            row: rowWithNullFileId,
            oldRowData
          })
          const url = wrapper.find('.UrlInput_test')
          url.vm.$emit('input', newUrl)
          const updatedRow = cloneDeep(row)
          row.data.url = newUrl
          row.data.fileId = null
          wrapper.setProps({
            row: updatedRow
          })
          await wrapper.vm.$nextTick()
        })

        test('"ImageRow" displays a "FirebaseUploader" card', () => {
          const fu = wrapper.find('.FirebaseUploader_test')
          expect(fu.exists()).toBe(true)
        })

        test('"ImageRow" displays no "WarningDeleteImage" card', () => {
          const card = wrapper.find('.WarningDeleteImage_test')
          expect(card.exists()).toBe(false)
        })
      })
    })
  })
})
