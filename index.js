const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const config = require('./config/key');
const cookieParser = require('cookie-parser');

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
app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
