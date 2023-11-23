const Validation = (values) => {
	let error = {};
	if (values.password === '') {error.password = 'Password should not be empty';}
	else if (values.email === '') {error.password = 'Email should not be empty';}
	else if (values.login === '') {error.password = 'Email should not be empty';}
	return error;
	
};

export default Validation;