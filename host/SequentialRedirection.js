import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import { addLine, editLine, resetLines, redirect } from './actions'

const mapStateToProps = ({ lines }) => {
  return { lines }
}

const actionCreators = {
  addLine, editLine, resetLines, redirect
}

class SequentialRedirection extends Component {
  constructor(props, context) {
    super(props, context)
    this.addLine = this.addLine.bind(this)
    this.resetLines = this.resetLines.bind(this)
    this.editLine = this.editLine.bind(this)
    this.redirect = this.redirect.bind(this)
    this.state = {
      lines: ["", ""]
    }
  }

  redirect() {
    const { lines, redirect } = this.props
    const from = lines[0].text, to = lines[1].text
    sendData("redirect", { from, to })
    redirect()
  }

  resetLines() {
    this.props.resetLines()
  }

  addLine() {
    const id = 1 + Math.max.apply(null, [0].concat(this.props.lines.map(line => line.id)))
    this.props.addLine(id.toString())
  }

  editLine(event, index) {
    this.props.editLine(index, event.target.value)
  }

  getLabel(index, length) {
    if (index == 0) {
      return "From: "
    } else if (index == length - 1) {
      return "To: "
    } else {
      return "Via: "
    }
  }

  render() {
    const { lines } = this.props;
    const canRedirect = lines.length >= 2 && lines[0].text.length && lines[1].text.length
    return (
      <div>
        <div>
          <RaisedButton
            label="リダイレクト"
            onClick={this.redirect}
            disabled={!canRedirect}
          />
        </div>
        {
          lines.map((token, index) => (
            <div key={token.id}>
              <label htmlFor={token.id}>{ this.getLabel(index, lines.length) }</label>
              <TextField
                id={token.id}
                value={token.text}
                onChange={(event) => this.editLine(event, index)}
              />
            </div>
          ))
        }
        <div>
          <RaisedButton
            label="行を追加"
            onClick={this.addLine}
          />
        </div>
        <div>
          <RaisedButton
            label="リセット"
            onClick={this.resetLines}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(SequentialRedirection);