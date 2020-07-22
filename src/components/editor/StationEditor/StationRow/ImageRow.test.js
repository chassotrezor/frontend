import { mountQuasar } from '@test'
import ImageRow from './ImageRow'
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

describe('ImageRow', () => {
  const row = cloneDeep(defaultRow)
  const wrapper = mountQuasar(ImageRow, {
    propsData: {
      row
    },
    mocks: {
      $route
    }
  })

  it('displays a "QImg" with "row.data.url" as "src" prop', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.props().src).toBe(defaultRow.data.url)
  })

  describe('widht handler', () => {
    const handler = wrapper.find('.WidthHandler_test')
    it('displays a width handler', () => {
      expect(handler.exists()).toBe(true)
    })

    it('emits "input" with "newWidth" when "WidthHandler" emits "input"', async () => {
      const newWidth = 80
      handler.vm.$emit('input', newWidth)
      await wrapper.vm.$nextTick()

      const expectedPayload = cloneDeep(defaultRow)
      expectedPayload.data.width = newWidth
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

    test('its "file-id" prop is "row.data.fileId" when "row.data.fileId" is defined', async () => {
      const row = cloneDeep(defaultRow)
      wrapper.setProps({ row })
      await wrapper.vm.$nextTick()
      expect(fu.props().fileId).toBe(defaultRow.data.fileId)
    })

    test('its "file-id" prop is "row.rowId" when "row.fileId" is undefined', async () => {
      const row = cloneDeep(defaultRow)
      row.data.fileId = undefined
      wrapper.setProps({ row })
      await wrapper.vm.$nextTick()
      expect(fu.props().fileId).toBe(defaultRow.rowId)
    })

    test('ImageRow emits "input" with updated row, when FirebaseUploader emits "uploaded" with new "url" and "fileId"', async () => {
      const row = cloneDeep(defaultRow)
      wrapper.setProps({ row })

      const newUrl = 'new/url'
      const newFileId = 'newFileId'

      fu.vm.$emit('uploaded', {
        url: newUrl,
        fileId: newFileId
      })
      await wrapper.vm.$nextTick()

      const expectedPayload = cloneDeep(defaultRow)

      expectedPayload.data.url = newUrl
      expectedPayload.data.fileId = newFileId
      expect(wrapper.emitted().input[1][0]).toEqual(expectedPayload)
    })
  })
})
