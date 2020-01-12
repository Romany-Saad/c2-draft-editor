import './styles/editor.scss'
import './styles/custom.scss'
import './styles/counter.css'
// import './styles/anchor.css'
import './styles/video.css'
import 'draft-js/dist/Draft.css'
import 'draft-js-alignment-plugin/lib/plugin.css'
import 'draft-js-static-toolbar-plugin/lib/plugin.css'

import React, { Component, Fragment } from 'react'
import {
  BlockquoteButton,
  BoldButton,
  CodeBlockButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from 'draft-js-buttons'
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import createVideoPlugin from 'draft-js-video-plugin'
import createToolbarPlugin from 'draft-js-static-toolbar-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createImagePlugin from 'draft-js-image-plugin'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
// import createCounterPlugin from 'draft-js-counter-plugin'
import createLinkPlugin from 'draft-js-anchor-plugin'
import createColorBlockPlugin from './colorBlock'
import VideoComponent from './components/VideoComponent'
import AddPlugin from './components/AddPlugin'

const focusPlugin = createFocusPlugin()
const alignmentPlugin = createAlignmentPlugin()
const {AlignmentTool} = alignmentPlugin
const resizeablePlugin = createResizeablePlugin()

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
)
const videoPlugin = createVideoPlugin({
  decorator,
  videoComponent: VideoComponent,
})
const linkPlugin = createLinkPlugin({
  placeholder: 'http://',
})
// const inlineToolbarPlugin = createInlineToolbarPlugin({
//   structure: [
//     BoldButton,
//     ItalicButton,
//     UnderlineButton,
//     linkPlugin.LinkButton,
//   ],
// })
// const {InlineToolbar} = inlineToolbarPlugin
const toolbarPlugin = createToolbarPlugin({decorator})
const imagePlugin = createImagePlugin({decorator, type: 'atomic'})
const {Toolbar} = toolbarPlugin
const colorBlockPlugin = createColorBlockPlugin({decorator})

// >>>>> counter plugin
// const counterPlugin = createCounterPlugin()
// const {WordCounter} = counterPlugin
// counter plugin <<<<<

const plugins = [
  videoPlugin, imagePlugin, resizeablePlugin,
  alignmentPlugin, focusPlugin, toolbarPlugin,
  /*counterPlugin, */colorBlockPlugin, /*inlineToolbarPlugin,*/ linkPlugin,
]

export default class CustomToolbarEditor extends Component {
  state = {
    editorState: null,
  }

  componentDidMount() {
    const {value} = this.props
    let jsonValue
    try {
      jsonValue = JSON.parse(value)
    } catch (e) {
      console.log('invalid editor state')
    } finally {
      if (jsonValue) {
        this.setState({
          editorState: EditorState.createWithContent(
            convertFromRaw(jsonValue),
          ),
        })
      } else {
        this.setState({
          editorState: EditorState.createEmpty(),
        })
      }
    }
  }

  onChange = editorState => {
    this.setState({editorState})
  }

  focus = () => {
    this.editor.focus()
  }

  onBlur = () => {
    const {name, onChange} = this.props
    const {editorState} = this.state
    const rawContent = convertToRaw(editorState.getCurrentContent())
    if (typeof window !== 'undefined') {
      onChange(name, JSON.stringify(rawContent))
    }
  }

  render() {
    const {editorState} = this.state
    const {addCustom} = this.props
    if (editorState === null) return null
    return (
      <div>
        <div className={'container-plugin'}>
          <AddPlugin
            editorState={this.state.editorState}
            onChange={this.onChange}
            modifier={videoPlugin.addVideo}
            plugin={videoPlugin}
            title={'video'}
          />

          <AddPlugin
            editorState={this.state.editorState}
            onChange={this.onChange}
            modifier={imagePlugin.addImage}
            plugin={imagePlugin}
            title={'image'}
          />

        </div>
        <div className='editor draft-js' onClick={this.focus} role="presentation">
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            onBlur={this.onBlur}
            plugins={plugins}
            ref={element => {
              this.editor = element
            }}
          />

          <Fragment>
            <Toolbar>
              {externalProps => {
                const newTheme = {
                  active: externalProps.theme.active + ' active',
                  button: externalProps.theme.button + ' button',
                  buttonWrapper: externalProps.theme.button + ' buttonWrapper',
                }
                const newProps = {
                  ...externalProps,
                  theme: {...externalProps.theme, ...newTheme},
                }
                return (
                  <Fragment>
                    <BoldButton {...newProps} />
                    <ItalicButton {...newProps} />
                    <UnderlineButton {...newProps} />
                    <CodeButton {...newProps} />
                    <HeadlineOneButton {...newProps} />
                    <HeadlineTwoButton {...newProps} />
                    <HeadlineThreeButton {...newProps} />
                    <UnorderedListButton {...newProps} />
                    <OrderedListButton {...newProps} />
                    <BlockquoteButton {...newProps} />
                    <CodeBlockButton {...newProps} />
                  </Fragment>
                )
              }}
            </Toolbar>
            <AlignmentTool/>
          </Fragment>
        </div>
        {/*<div><WordCounter className={'counter'} limit={30}/> words</div>*/}
      </div>
    )
  }
}
