const express = require('express');
const app = express();
const port = 5000;
const bodyParser=require('body-parser')
const {User}=require("./models/User")

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extends:true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chungheon:1234@boilerplate.tcisn.mongodb.net/?retryWrites=true&w=majority&appName=boilerplate',{})
    .then(()=>console.log('MongoDB Connected...'))
    .catch(err=>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req,res)=>{
    //회원가입 할 때 필요한 정보들을 클라이언트에서 가져오면 
    //그것들을 db에 넣어준다.
    const user = new User(req.body)

    user.save()
    .then((doc) => {
        res.status(200).json({ success: true, doc });
    })
    .catch((err) => {
        res.json({ success: false, err });
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
