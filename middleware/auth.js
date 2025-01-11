
//auth는 인증을 처리하는 미들웨어로, req.user와 req.token 값을 설정합니다.


const { User } = require('../models/User');

let auth = async (req, res, next) => {
  try {
    let token = req.cookies.x_auth;
    if (!token) {
      return res.status(401).json({ isAuth: false, error: 'Token is missing' });
    }

    let user = await User.findByToken(token);
    if (!user) {
      return res.status(401).json({ isAuth: false, error: 'User not found' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ isAuth: false, error: err.message });
  }
};

module.exports = { auth };

  
  module.exports = { auth };
  


module.exports={auth};