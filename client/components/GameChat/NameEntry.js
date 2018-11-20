import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import { userSet } from '../../store/gameChat'

export class NameEntry extends Component {
    constructor() {
        super()
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const { value: name } = event.target
        this.props.userSet(name)
    }

    render() {
    console.log(this.props)
        return (
            <Fragment>
                <label htmlFor="name">Your name:</label>
                <input
                    name="name"
                    onChange={this.handleChange}
                    // value={this.props.userName}
                />
            </Fragment>
        )
    }
}

export default connect(
    state => ({
        userName: state.user,
    }),
    dispatch => ({
        userSet: nameStr => dispatch(userSet(nameStr)),
    })
)(NameEntry)