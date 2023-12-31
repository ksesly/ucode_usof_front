import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Validation from '../../helpers/registerValidation';

const Register = () => {
	const [values, setValues] = useState({
		login: '',
		fullName: '',
		email: '',
		password: '',
		passwordConfirmation: '',
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleInput = (ev) => {
		const { name, value } = ev.target;
		setValues((prevValues) => ({ ...prevValues, [name]: value }));
	};

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		setErrors(Validation(values));

		if (!errors.password) {
			try {
				const res = await axios.post(
					'http://127.0.0.1:3050/api/auth/register',
					values
				);
				// console.log(res.data.token);
				Cookies.set('token', `Bearer ${res.data.token}`, { expires: 7 });
				Cookies.set('user', `${res.data.data.user_id}`, { expires: 7 });

				navigate('/mainPage');
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div>
			<div>
				<form action="" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="login">Log in</label>
						<input
							type="login"
							name="login"
							placeholder="Enter login"
							onChange={handleInput}
						/>
					</div>
					<div>
						<label htmlFor="fullName">Full Name</label>
						<input
							type="fullName"
							name="fullName"
							placeholder="Enter your full name"
							onChange={handleInput}
						/>
					</div>
					<div>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							placeholder="Enter email"
							onChange={handleInput}
						/>
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							placeholder="Enter password"
							onChange={handleInput}
						/>
						{errors.password && <span>{errors.password}</span>}
					</div>
					<div>
						<label htmlFor="passwordConfirmation">Password</label>
						<input
							type="password"
							name="passwordConfirmation"
							placeholder="Enter password again"
							onChange={handleInput}
						/>
					</div>
					<button type="submit">Sign up</button>
					<Link to="/login">Already have an account?</Link>
				</form>
			</div>
		</div>
	);
};

export default Register;
