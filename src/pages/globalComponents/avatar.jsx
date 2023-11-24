import React, { useState, useEffect } from 'react';
import '../../style/header.scss';
import axios from 'axios';
import Cookies from 'js-cookie';

const Avatar = () => {
	const [profilePic, setProfilePic] = useState({});
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = Cookies.get('token');

				if (token) {
					console.log('Token exists:', token);
					const response = await axios.get(
						'http://127.0.0.1:3050/api/users/currentUser',
						{ responseType: 'blob' },
						{
							headers: {
								Authorization: `Bearer%20${token}`,
							},
						}
					);

					console.log(response.data);
					let imgUrl = URL.createObjectURL(response.data);
					setProfilePic(imgUrl);
					console.log(imgUrl);
				} else {
					console.log('Token does not exist');
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	return (
		<div className="header">
			<img
				src={profilePic.profilePicture}
				style={{
					width: '50px',
					height: '50px',
					// borderRadius: '50%',
				}}
			/>
		</div>
	);
};

export default Avatar;
