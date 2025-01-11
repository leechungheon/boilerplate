const express = require('express');
const app = express();
const port = 5000;
const config = require('./config/key');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require('./models/User');
const { auth } = require('./middleware/auth');


// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoUrl, {})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! I am Chungheon');
});

// 회원가입
app.post('/api/users/register', async (req, res) => {
  try {
    //회원가입 할 때 필요한 정보들을 클라이언트에서 가져오면 
    //그것들을 db에 넣어준다.
    const user = new User(req.body);

    const doc = await user.save();
    res.status(200).json({ success: true, doc });
  } catch (err) {
    res.json({ success: false, err });
  }
});

// 로그인
app.post('/api/users/login', async (req, res) => {
  try {
    //요청된 email을 db에서 존재하는지 확인
    const userInfo = await User.findOne({ email: req.body.email });

    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    //email이 db에 있다면 password가 맞는지 확인
    const isMatch = await userInfo.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: '비밀번호가 틀렸습니다.',
      });
    }

    //password가 맞다면 token을 생성
    const user = await userInfo.generateToken();
    res.cookie('x_auth', user.token)
      .status(200)
      .json({ loginSuccess: true, userId: user._id });

  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/users/auth', auth, (req,res)=>{

    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말
    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role===0?false:true, //role 0->일반유저, 아니면 관리자
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
console.log('Auth Middleware:', auth); // auth의 값을 출력

