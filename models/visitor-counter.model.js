const mongoose =require('mongoose')

const counterSchema =  new mongoose.Schema({
   counter:{
      type:Number,
   }
})
const Counter = mongoose.model('Counter',counterSchema,'Counter')

module.exports = Counter