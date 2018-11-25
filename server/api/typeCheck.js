function isLoggedIn(req, res, next) {
  if (!req.user) {
    res.status(401).send('Please log in before trying that.')
  }
  if (req.user.userType === 'regular' || req.user.userType === 'admin') {
    next()
  } else {
    res.status(401).send('You are not authorized to do that.')
  }
}

function isLoggedInAsSelf(req, res, next) {
  if (!req.user) {
    res.status(401).send('You are not authorized to do that.')
  } else if (
    req.user.userType === 'admin' ||
    req.user.id === Number(req.params.userId)
  ) {
    next()
  } else {
    res.status(401).send('You are not authorized to do that.')
  }
}

function isAdmin(req, res, next) {
  if (!req.user) {
    res.status(401).send('Please log in before trying that.')
  }
  if (req.user.userType === 'admin') {
    next()
  } else {
    res.status(401).send('You are not authorized to do that.')
  }
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isLoggedInAsSelf
}
