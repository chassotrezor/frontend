import { mountQuasar } from '@test'
import ImageRow from './ImageRow'

const $route = {
  params: {
    trailId: 'testTrailId',
    stationId: 'testStationId'
  }
}

const defaultRow = {
  data: {
    url: 'path/to/file',
    fileId: 'testFileId'
  },
  rowId: 'testRowId'
}

describe('ImageRow', () => {
  const wrapper = mountQuasar(ImageRow, {
    propsData: {
      row: {
        ...defaultRow
      }
    },
    mocks: {
      $route
    }
  })

  it('displays a "QImg" with "row.data.url" as "src" prop', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.props().src).toBe(defaultRow.data.url)
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
      wrapper.setProps({
        row: {
          ...defaultRow
        }
      })
      await wrapper.vm.$nextTick()
      expect(fu.props().fileId).toBe(defaultRow.data.fileId)
    })

    test('its "file-id" prop is "row.rowId" when "row.fileId" is undefined', async () => {
      wrapper.setProps({
        row: {
          ...defaultRow,
          data: {
            ...defaultRow,
            fileId: undefined
          }
        }
      })
      await wrapper.vm.$nextTick()
      expect(fu.props().fileId).toBe(defaultRow.rowId)
    })

    test('ImageRow emits "input" with updated row, when FirebaseUploader emits "uploaded" with new "url" and "fileId"', async () => {
      const newUrl = 'new/url'
      const newFileId = 'newFileId'

      fu.vm.$emit('uploaded', {
        url: newUrl,
        fileId: newFileId
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().input[0][0]).toEqual({
        ...defaultRow,
        data: {
          url: newUrl,
          fileId: newFileId
        }
      })
    })
  })
})
