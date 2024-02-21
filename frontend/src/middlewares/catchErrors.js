// const submitHandler = async ({ email, password }, { setSubmitting }) => {
//     await login({ email, password }).unwrap();
//     setSubmitting(false);
//     toast.success("Successfully LoggedIn");
//     navigate("/");

//     const
//     authService.signUp(values,login)
// };

// signUp=(values,function)=>catchErrors(values,async (values) =>{
//     const {email,password,setSubmitting} = values
//     await function(values).unwrap();
//     setSubmitting(false);
//     successHandler()
//     navigate("/")
// })

const catchErrors = (values, fn) => {
  Promise.resolve(fn(values)).catch((err) => ErrorHandler(err));
};

export default catchErrors;
