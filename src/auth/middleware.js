import User from './user.js';

export default (capability) => {
  return (req, res, next) => {
    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);
      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }
    } catch (e) {
      return _authError();
    }

    function _authBasic(authString) {
      let base64Buffer = Buffer.from(authString, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      let auth = {
        username,
        password,
      };
      return User.authenticateBasic(auth)
        .then(user => _authenticate(user));
    }

    function _authBearer(authString) {
      return User.authenticateToken(authString)
        .then(user => _authenticate(user));
    }

    function _authenticate(user) {
      if (user && (!capability || (user.can(capability)))) {
        req.user = user;
        req.token = user.generateToken();
        next();
      } else {
        _authError();
      }
    }

    function _authError() {
      next({
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid User ID/Password',
      });
    }
  };
};
