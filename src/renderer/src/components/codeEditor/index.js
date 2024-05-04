import React from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-gitignore'
import 'ace-builds/src-noconflict/theme-textmate'
// ace.config.set('basePath', '/path/to/ace');
import './modes/mode-rewrite'

function CodeEditor(props) {
  const { value, onChange, mode = 'json', ...options } = props
  // if (typeof value === 'undefined') return <div style={{ width: '100%', height: '100%' }}></div>
  return (
    <AceEditor
      name="ace-editor"
      mode={mode}
      // mode="rewrite"
      theme="textmate"
      showPrintMargin={false}
      value={value}
      onChange={onChange}
      style={{ height: '100%', width: '100%' }} // 必须得设置宽高
      fontSize={'16px'}
      tabSize={2}
      focus={true}
      {...options}
    />
  )
}

export default CodeEditor
