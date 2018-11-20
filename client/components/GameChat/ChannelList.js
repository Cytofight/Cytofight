import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// These values are all hardcoded...for now!
// Soon, we'll fetch them from the server!
const GAME_CHANNEL = '/channels/1'
const GENERAL_CHANNEL = '/channels/2'

export class ChannelList extends Component {
    render() {
        console.log("PROPS: ", this.props)
        const filterMessageChannel = id =>
            this.props.messages.filter(m => m.channelId === id)
        const gameMessages = filterMessageChannel(1)
        const generalMessages = filterMessageChannel(2)

        return (
            <ul>
                <li>
                    <NavLink to={GAME_CHANNEL} activeClassName="active">
                        <span># really_GAME</span>
                        <span className="badge">{ gameMessages.length }</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={GENERAL_CHANNEL} activeClassName="active">
                        <span># generally_speaking</span>
                        <span className="badge">{ generalMessages.length }</span>
                    </NavLink>
                </li>
            </ul>
        )
    }
}

const mapState = state => {
    console.log("message from state: ", state)
    return (  
    {
    messages: state.chatReducer.messages,
})}

export default withRouter(connect(mapState)(ChannelList))