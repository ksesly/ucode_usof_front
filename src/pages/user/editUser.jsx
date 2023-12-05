import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import HeaderForCurrentUser from '../globalComponents/headerForCurrentUser';
import { useNavigate } from 'react-router-dom';

function EditUserPage() {
	const [userData, setUserData] = useState({
		login: '',
		email: '',
        fullName: ''
	});
    const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = Cookies.get('token');

				if (token) {
					const response = await axios.get(
						'http://127.0.0.1:3050/api/users/currentUser',
						{
							headers: {
								Authorization: `Bearer%20${token}`,
							},
						}
					);

					setUserData((prevUserData) => ({
						...prevUserData,
						...response.data,
					}));
				} else {
					console.log('Token does not exist');
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

    console.log(userData)

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData((prevUserData) => ({
			...prevUserData,
			[name]: value,
		}));
	};

	const handleSaveChanges = async () => {
		try {
			const token = Cookies.get('token');

			if (token) {
				const response = await axios.patch(
					`http://127.0.0.1:3050/api/users/${userData.user_id}`,
					userData,
					{
						headers: {
							Authorization: `Bearer%20${token}`,
						},
					}
				);
                navigate('/user/me')
				console.log(response);
			} else {
				console.log('Token does not exist');
			}
		} catch (error) {
			console.error('Error updating user data:', error);
		}
	};

	return (
		<div>
			<HeaderForCurrentUser />
			<h1>Edit User Data</h1>
			<form>
				<div>
					<label>Login:</label>
					<input
						type="text"
						name="login"
						value={userData.login}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="text"
						name="email"
						value={userData.email}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Full name:</label>
					<input
						type="text"
						name="fullName"
						value={userData.fullName}
						onChange={handleInputChange}
					/>
				</div>

				<button type="button" onClick={handleSaveChanges}>
					Save Changes
				</button>
			</form>
		</div>
	);
}

export default EditUserPage;
