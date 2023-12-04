import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/header.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import Avatar from '../globalComponents/avatar';
import Header from './header';
import Validation from '../../helpers/postAddingValidation';

const AddPost = () => {
	const [values, setValues] = useState({
		title: '',
		content: '',
		categories: [],
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const tokenRef = useRef(null);

	const handleInput = (ev) => {
		const { name, value } = ev.target;
		if (name === 'categories') {
			setValues((prevValues) => ({
				...prevValues,
				[name]: value.split(',').map((category) => category.trim()),
			}));
		} else {
			setValues((prevValues) => ({ ...prevValues, [name]: value }));
		}
	};

	const handleAddingPost = async (ev) => {
		ev.preventDefault();
		setErrors(Validation(values));
		console.log(errors);
		if (!errors.title || !errors.content) {
			try {
				tokenRef.current = Cookies.get('token');
				console.log(tokenRef.current);
				const res = await axios.post(
					'http://127.0.0.1:3050/api/posts/',
					values,
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				console.log(res);
				navigate('/mainPage');
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="add-post">
			<Header />
			<div>
				<form action="" onSubmit={handleAddingPost}>
					<div>
						<label htmlFor="title">Title</label>
						<input
							type="text"
							name="title"
							placeholder="Enter title"
							onChange={handleInput}
						/>
					</div>
					<div>
						<label htmlFor="content">Content</label>
						<input
							type="text"
							name="content"
							placeholder="Enter content"
							onChange={handleInput}
						/>
					</div>
					<div>
						<label htmlFor="categories">Categories</label>
						<input
							type="text"
							name="categories"
							placeholder="Enter categories separated by commas"
							onChange={handleInput}
						/>
					</div>
					<button type="submit">Add post</button>
				</form>
			</div>
		</div>
	);
};

export default AddPost;
