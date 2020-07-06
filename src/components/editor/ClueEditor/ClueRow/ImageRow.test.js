import { mountQuasar } from '@test'
import ImageRow from './ImageRow'

const $route = {
  params: {
    trailId: 'testTrailId',
    clueId: 'testClueId'
  }
}

const defaultRow = {
  url: 'path/to/file',
  rowId: 'testRowId',
  fileId: 'testFileId'
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

  it('displays a "QImg" with "row.url" as "src" prop', () => {
    const img = wrapper.find('.QImg_test')
    expect(img.props().src).toBe(defaultRow.url)
  })

  describe('FirebaseUploader', () => {
    const fu = wrapper.find('.FirebaseUploader_test')

    test('its "path" prop is "trailId/clueId"', () => {
      const trailId = $route.params.trailId
      const clueId = $route.params.clueId
      const expectedPath = `${trailId}/${clueId}`
      expect(fu.props().path).toBe(expectedPath)
    })

    test('its "file-id" prop is "row.fileId" when "row.fileId" is defined', async () => {
      wrapper.setProps({
        row: {
          ...defaultRow
        }
      })
      await wrapper.vm.$nextTick()
      expect(fu.props().fileId).toBe(defaultRow.fileId)
    })

    test('its "file-id" prop is "row.rowId" when "row.fileId" is undefined', async () => {
      wrapper.setProps({
        row: {
          ...defaultRow,
          fileId: undefined
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
        url: newUrl,
        fileId: newFileId
      })
    })
  })
})
