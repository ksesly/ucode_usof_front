import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/header.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import Avatar from '../globalComponents/avatar';

const Header = () => {
	const [userData, setUserData] = useState({});
	const [scrollDirection, setScrollDirection] = useState('scroll-up');
	const navigate = useNavigate();
	const tokenRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			const currentScroll = window.pageYOffset;
			if (currentScroll > lastScroll) {
				setScrollDirection('scroll-down');
			} else {
				setScrollDirection('scroll-up');
			}
			lastScroll = currentScroll;
		};

		let lastScroll = window.pageYOffset;
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(
		() => {
			const fetchUserData = async () => {
				try {
					tokenRef.current = Cookies.get('token');
					const token = tokenRef.current;

					if (token) {
						// console.log('Token exists:', token);
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
						;
					} else {
						console.log('Token does not exist');
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
				}
			};

			fetchUserData();
		},
		[
			// userData
		]
	);

	// console.log(userData)
	const handleUserImage = async (ev) => {
		ev.preventDefault();

		if (tokenRef.current) {
			navigate(`/user/${userData.user_id}`);
		} else {
			navigate('/notAuthOrReg');
		}
	};

	return (
		<div className={`header ${scrollDirection}`}>
			<div className="header-field logo">for name and camp photo</div>
			<div className="right-part-header">
				<div className="header-field search-bar">for find bar</div>
				<div className="header-field avatar-login">
					<div className="header-login">
						{userData.login ? userData.login : 'guest'}
					</div>
					<div onClick={handleUserImage}>
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
