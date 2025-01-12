const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const saltRounds=10;
const jwt=require('jsonwebtoken');

const userSchema=mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, //space 제거
        unique: 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image:String,
    token:{
        type: String
    },
    tokenExp:{
        type:Number
    }

})


userSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err)return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err)return next(err)
            user.password=hash
            // Store hash in your password DB.
            next()
        })
    })
    }else{
        next()
    }
    
})

// User.js
userSchema.methods.comparePassword = async function (plainPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, this.password);
      return isMatch; // 비밀번호가 일치하면 true, 아니면 false 반환
    } catch (err) {
      throw err; // 에러 발생 시 throw
    }
  };
  
// User.js

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
  
    user.token = token;
    try {
      const updatedUser = await user.save(); // async/await 방식으로 저장
      return updatedUser; // 저장된 유저 반환
    } catch (err) {
      throw err; // 에러 발생 시 throw
    }
  };  

  userSchema.statics.findByToken = async function (token) {
    try {
      const decoded = jwt.verify(token, 'secretToken');
      const user = await this.findOne({ _id: decoded, token });
      return user;
    } catch (err) {
      console.error('findByToken Error:', err); // 디버깅용 로그 추가
      return null; // null 반환
    }
  };
  

  
const User = mongoose.model('User', userSchema)

module.exports={User}