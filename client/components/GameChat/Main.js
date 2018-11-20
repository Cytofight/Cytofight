import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MessagesList from './MessagesList';
import { fetchMessages } from '../../store/gameChat'

export class Main extends Component {
  componentDidMount () {
    this.props.loadMessages()
  }
  
  render () {
    console.log("MAIN PROPS: ", this.props)
    return (
      <div>
        <Sidebar />
        <Navbar />
        <main>
          <Switch>
            <Route path="/channels/:channelId" component={MessagesList} />
            {/* <Redirect to="/channels/1" /> */}
          </Switch>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadMessages: () => dispatch(fetchMessages()),
})

export default withRouter(connect(null, mapDispatchToProps)(Main))