import React, { Component } from 'react';
import { sendMessage } from '../../store'
// use `withRouter` if we have update blocking issues
import { connect } from 'react-redux'

export class NewMessageEntry extends Component {

  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    const message = event.target.content.value
    this.props.submitMessage({
      content: message,
      channelId: this.props.channelId
    })
  }

  render () {
    console.log("NEWMESSAGEENTRY PROPS: ", this.props)
    return (
      <form id="new-message-form" onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            type="text"
            name="content"
            placeholder="Say something nice..."
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Chat!</button>
          </span>
        </div>
      </form>
    );
  }
}

const mapDispatch = dispatch => ({
  submitMessage: message => dispatch(sendMessage(message))
})

export default connect(null, mapDispatch)(NewMessageEntry)