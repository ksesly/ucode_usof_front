const Validation = (values) => {
	let error = {};
	if (values.title === '') {error.title = 'Field should not be empty';}
	else if (values.content === '') {error.content = 'Field should not be empty';}
	return error;
	
};

export default Validation;