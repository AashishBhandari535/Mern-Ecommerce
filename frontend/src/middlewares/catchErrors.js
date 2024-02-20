const submitHandler = async ({ email, password }, { setSubmitting }) => {
    await login({ email, password }).unwrap();
    setSubmitting(false);
    toast.success("Successfully LoggedIn");
    navigate("/"); 
};


const catchErrors = (values,function) => function(values).catch((err) => console.log(err));



catchErrors(submitHandler);

export default catchErrors;
