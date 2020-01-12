import React, { Component } from 'react'
import Editor from 'c2-draft-editor'

// import 'c2-draft-editor/dist/styles/anchor.css'
// import 'c2-draft-editor/dist/styles/counter.css'
// import 'c2-draft-editor/dist/styles/Draft.css'
// import 'c2-draft-editor/dist/styles/editor.css'
// import 'c2-draft-editor/dist/styles/plugin.css'
import 'c2-draft-editor/dist/index.css'

export default class App extends Component {
  state = {
    editorState: '',
  }

  render() {
    const {editorState} = this.state
    return (
      <div>
        <Editor
          value={editorState}
          name='test'
          onChange={(name, value) => {
            this.setState({editorState: value})
          }}
        />
        <pre>
          <code>{editorState.length > 0 && JSON.stringify(JSON.parse(editorState), null, 2)}</code>
        </pre>
      </div>
    )
  }
}
