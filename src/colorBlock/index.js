import React from 'react'

const ColorBlock = ({
  block, blockProps, customStyleMap,
  customStyleFn, decorator, forceSelection,
  offsetKey, selection, tree, contentState, style,
  ...elementProps
}) => (
  <div
    {...elementProps}
    style={{width: 200, height: 80, backgroundColor: '#9bc0c7', ...style}}
  />
)

const createColorBlockPlugin = (config = {}) => {
  const component = config.decorator ? config.decorator(ColorBlock) : ColorBlock
  return {
    blockRendererFn: (block, {getEditorState}) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent()
        const entity = contentState.getEntity(block.getEntityAt(0))
        const type = entity.getType()
        if (type === 'ColorBlock') {
          return {
            component,
            editable: false,
          }
        }
      }
      return null
    },
  }
}

export default createColorBlockPlugin
