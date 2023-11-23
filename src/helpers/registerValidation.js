const Validation = (values) => {
	let error = {};
	const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
	if (values.password === '') {error.password = 'Password should not be empty';}
	else if (!passwordPattern.test(values.password))
		
		{error.password = 'password didn`t match';}
	else{ error.password = '';}
	
	return error;
	
};

export default Validation;