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

	useEffect(() => {
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
	}, [
        // user_id
    ]);

    console.log(userData)

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
	}

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
					</div>
					<div className="user-login">{userData.login}</div>
				</div>
				{/* <div className='add-post-button-div'> */}
					<button className='add-post-button' onClick={handlePostAdding}>Add post</button>
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
