const express = require('express');
const app = express();

// 환경 변수에서 포트 가져오기 (없으면 기본값 5000 사용)
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chungheon:1234@boilerplate.tcisn.mongodb.net/?retryWrites=true&w=majority&appName=boilerplate',{})
    .then(()=>console.log('MongoDB Connected...'))
    .catch(err=>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
