const Counter = require('../../../models/visitor-counter.model')


const updateCounter = async (req, res, next) => {
   // counter
   const counter = await Counter.findById('654e7860e37bca1eee08a9cd')
   let _counter = counter.counter
   const newCounter = await Counter.findByIdAndUpdate('654e7860e37bca1eee08a9cd',
      { counter: _counter + 1 },
      { new: true })
   return res.status(200).json(newCounter)
}

module.exports = { updateCounter }