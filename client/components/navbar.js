import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {withStyles, CssBaseline, Toolbar} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Drawer from '@material-ui/core/Drawer'
import ListItem from '@material-ui/core/ListItem'

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
}

class Navbar extends React.Component {
  state = {
    left: false
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    })
  }

  render() {
    const {handleClick, isLoggedIn, classes} = this.props

    const sideList = (
      <div className={classes.list}>
        {isLoggedIn ? (
          <List>
            {/* The navbar will show these links after you log in */}
            <Link to="/home">Home</Link>
            <Link to="/game">Play!</Link>
            <Link to="/heroes">Meet the Heroes</Link>
            <Link to="/villains">Meet the Villains</Link>
            <a href="#" onClick={handleClick}>
              Logout
            </a>
          </List>
        ) : (
          <List>
            <ListItem>{<Link to="/login">Login</Link>}</ListItem>
            <ListItem>{<Link to="/signup">Sign Up</Link>}</ListItem>
            <ListItem>{<Link to="/game">Play!</Link>}</ListItem>
            <ListItem>{<Link to="/heroes">Meet the Heroes</Link>}</ListItem>
            <ListItem>{<Link to="/villains">Meet the Villains</Link>}</ListItem>
            <ListItem>{<Link to="/messages">Messages</Link>}</ListItem>
          </List>
        )}
      </div>
    )

    return (
      <div position="fixed">
        <Button onClick={this.toggleDrawer('left', true)}>...</Button>
        <Drawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    )
  }
}

// const Navbar = ({handleClick, isLoggedIn, classes}) => (
//   <div>
//     <CssBaseline />
//     <AppBar className={classes.appBar}>
//       <Toolbar className={classes.toolbar} />
//       <hr />
//     </AppBar>
//   </div>
// )

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(withStyles(styles)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
}
