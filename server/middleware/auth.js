
//auth는 인증을 처리하는 미들웨어로, req.user와 req.token 값을 설정합니다.


const { User } = require('../models/User');

let auth = async (req, res, next) => {
    try {
      // 클라이언트에서 보내온 쿠키에서 'x_auth' 토큰을 가져옵니다.
      let token = req.cookies.x_auth;
  
      // 토큰이 없는 경우, 인증되지 않았음을 나타내는 응답을 보냅니다.
      if (!token) {
        return res.status(401).json({ isAuth: false, error: 'Token is missing' });
      }
  
      // 토큰을 통해 해당 토큰과 연결된 사용자를 찾아봅니다.
      let user = await User.findByToken(token);
      
      // 사용자가 존재하지 않으면 인증 실패로 간주하고 에러 메시지를 반환합니다.
      if (!user) {
        return res.status(401).json({ isAuth: false, error: 'User not found' });
      }
  
      // 인증이 성공적으로 완료된 경우, 요청 객체(req)에 토큰과 사용자 정보를 저장합니다.
      req.token = token;
      req.user = user;
  
      // 인증을 통과한 후, 다음 미들웨어나 라우트로 넘어갈 수 있도록 next() 호출
      next();
    } catch (err) {
      // 예기치 않은 에러가 발생했을 경우, 500 상태 코드와 함께 에러 메시지를 반환합니다.
      res.status(500).json({ isAuth: false, error: err.message });
    }
  };
  

module.exports = { auth };