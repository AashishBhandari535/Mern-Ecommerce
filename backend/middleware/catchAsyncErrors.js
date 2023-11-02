// module.exports = func =>(req,res,next)=>
//     Promise.resolve(func(req,res,next))
//         .catch(next)

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
module.exports = catchAsync;