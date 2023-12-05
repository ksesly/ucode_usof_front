import '../../style/post.scss';
import React, { useState, useEffect } from 'react';
import HeaderForCurrentUser from '../globalComponents/headerForCurrentUser';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../globalComponents/avatar';
import Post from '../globalComponents/Post';
import Cookies from 'js-cookie';

function CurrentUserPage() {
	// const { user_id } = useParams();
	const [userData, setUserData] = useState({});
	const [postData, setPostData] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();
	const [avatarFile, setAvatarFile] = useState(null);

	useEffect(
		() => {
			const fetchUserData = async () => {
				try {
					const token = Cookies.get('token');

					if (token) {
						const response = await axios.get(
							`http://127.0.0.1:3050/api/users/currentUser`,
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
		},
		[
			// userData
		]
	);

	console.log(userData);

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const token = Cookies.get('token');

				if (token) {
					const response = await axios.get(
						`http://127.0.0.1:3050/api/users/${userData.user_id}/posts?page=${currentPage}`,
						{
							headers: {
								Authorization: `Bearer%20${token}`,
							},
						}
					);

					setPostData((prevPostData) => ({
						...prevPostData,
						...response.data,
					}));
				} else {
					console.log('Token does not exist');
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchPostData();
	}, [userData.user_id, currentPage]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handlePostAdding = () => {
		navigate('/addPost');
	};
	const handleEditUser = () => {
		navigate('/edit');
	};

	const handleAvatarChange = (event) => {
		const file = event.target.files[0];
		setAvatarFile(file);
	};

	const handleUploadAvatar = async () => {
		try {
			
			const formData = new FormData();
			formData.append('profilePicture', avatarFile);

			const token = Cookies.get('token');

			if (token) {
				console.log('pipipi')
				const response = await axios.patch(
					`http://127.0.0.1:3050/api/users/avatar`,
					formData,
					{
						headers: {
							Authorization: `Bearer%20${token}`,
							'Content-Type': 'multipart/form-data',
						},
					}
				);

				console.log(response.data);
				// Обновите состояние с новыми данными о пользователе, включая новый аватар
				setUserData((prevUserData) => ({
					...prevUserData,
					...response.data,
				}));
			} else {
				console.log('Token does not exist');
			}
		} catch (error) {
			console.error('Error uploading avatar:', error);
		}
	};

	console.log(userData);
	return (
		<div className="user-page">
			<HeaderForCurrentUser />
			<div className="user-info-posts">
				<div className="user-avatar-login">
					<div className="user-avatar">
						<Avatar
							profilePicture={userData.profilePicture}
							altText="User Avatar"
						/>
						<input
							type="file"
							accept="image/*"
							onChange={handleAvatarChange}
						/>
						<button onClick={handleUploadAvatar}>
							Upload Avatar
						</button>
					</div>
					<div className="user-login">{userData.login}</div>
					<div className="user-login">{userData.fullName}</div>
				</div>
				<button onClick={handleEditUser}>edit user</button>
				{/* <div className='add-post-button-div'> */}
				<button className="add-post-button" onClick={handlePostAdding}>
					Add post
				</button>
				{/* </div> */}
				<div className="post-block">
					<div className="post-panel">
						<div className="posts-tab"></div>
						<div className="favoarite-tab"></div>
					</div>
					<div className="posts">
						{postData.data
							? postData.data.map((post) => (
									<Post
										key={post.post_id}
										post_id={post.post_id}
									/>
							  ))
							: null}
					</div>
					{postData.pagination && (
						<div className="pagination">
							{Array.from(
								{ length: postData.pagination.totalPages },
								(_, index) => (
									<button
										key={index + 1}
										onClick={() =>
											handlePageChange(index + 1)
										}
										className={
											index + 1 === currentPage
												? 'active'
												: ''
										}
									>
										{index + 1}
									</button>
								)
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default CurrentUserPage;
