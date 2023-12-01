import React, { useState, useEffect } from 'react';
import '../../style/header.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import Avatar from '../globalComponents/avatar';

const Header = () => {
	const [userData, setUserData] = useState({});
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = Cookies.get('token');

				if (token) {
					console.log('Token exists:', token);
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
					console.log(userData);
				} else {
					console.log('Token does not exist');
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, [userData]);


	return (
		<div className="header">
			<div className="header-field logo">for name and camp photo</div>
			<div className="right-part-header">
				<div className="header-field search-bar">for find bar</div>
				<div className="header-field avatar-login">
					<div className="header-login">{userData.login}</div>
					<div>
						<Avatar
							profilePicture={userData.profilePicture}
							altText="User Avatar"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
