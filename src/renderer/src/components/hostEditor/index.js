import './index.css'
const regRN = /\r\n/g

class HostEditor {
  constructor(params) {
    const { id, value = '', onChange } = params
    this.id = id
    this.value = value
    this.onChange = onChange
    this.createEditor()
    this.initData()
  }
  createEditor() {
    this.container = document.createElement('div')
    this.container.className = 'hostEditor'
    document.querySelector(this.id).appendChild(this.container)
  }
  initData() {
    const lines = this.value.split(regRN)
    console.log(lines);
    lines.forEach((text, index) => {
      this.createLine(text, index)
    })
  }
  createLine(t, index) {
    const text = t.trim()
    // const [before, after] = texts
    const isComment = text.startsWith('#')
    const isSussess = !isComment && text.split(/\s+/).length === 2
    let before = ''
    let after = ''
    if (isComment) {
      this.createCommentLine(t, index)
      return
    }
    if (isSussess) {
      const i = text.split(/\s+/)[0].length
      before = text.slice(0, i)
      after = text.slice(i)
      this.createSuccessLine(before, after, index)
      return
    }
    this.createErrorLine(t, index)
  }
  createCommentLine(t, index) {
    const line = document.createElement('div')
    line.className = 'hostEditorLine hostEditorComment'
    line.innerHTML = t
    const els = this.container.querySelectorAll('.hostEditorLine')
    if (els.length === 0) {
      this.container.appendChild(line)
    } else {
      this.container.insertBefore(els[index - 1], line)
    }
  }
  createErrorLine(t, index) {
    const line = document.createElement('div')
    line.className = 'hostEditorLine hostEditorError'
    line.innerHTML = t
    const els = [...this.container.querySelectorAll('.hostEditorLine')]
    if (els.length === 0 || index === els.length) {
      this.container.appendChild(line)
    } else {
      console.log(els[index - 1]);
      this.container.insertBefore(line, els[index])
    }
  }
  createSuccessLine(before, after, index) {
    const line = document.createElement('div')
    line.className = 'hostEditorLine hostEditorSuccess'
    line.innerHTML = `<span>${before}</span><span>${after}</span>`
    const els = this.container.querySelectorAll('.hostEditorLine')
    if (els.length === 0 || index === els.length) {
      this.container.appendChild(line)
    } else {
      this.container.insertBefore(line, els[index])
    }
  }
}

export default HostEditor