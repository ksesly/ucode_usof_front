import React, { useState } from 'react';
import Validation from '../../helpers/registerValidation';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
	const [values, setValues] = useState({
		login: '',
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});

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
					'http://127.0.0.1:3050/api/auth/login',
					values
				);
				Cookies.set(res.data.token, { expires: 7, secure: true });
				console.log(res);
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
					<button type="submit">Sign in</button>
					<Link to="/register">Do not have an account?</Link>
				</form>
			</div>
		</div>
	);
};

export default Login;
