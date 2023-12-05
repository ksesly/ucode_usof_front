import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Avatar from './avatar';
import Comments from './comment';

function Post({ post_id }) {
	const [postData, setPostData] = useState({});
	const [editablePostData, setEditablePostData] = useState({});
	const [reactionData, setReactionData] = useState({});
	const [reactionNumberData, setReactionNumberData] = useState({});
	const [activeButton, setActiveButton] = useState(null);
	const [reactionNumbers, setReactionNumbers] = useState({
		like: 0,
		dislike: 0,
	});
	const [editMode, setEditMode] = useState(false);
	const [isFavorited, setIsFavorited] = useState(false); // Новое состояние для отслеживания, добавлен ли пост в избранное
	const tokenRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const user = Cookies.get('user');
	const [content, setContent] = useState('');

	const getTime = (time) => {
		const dateObject = new Date(time);
		const formattedDate = dateObject.toISOString().split('T')[0];
		return formattedDate;
	};

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:3050/api/posts/${post_id}`,
					{}
				);
				response.data.createdAt = getTime(response.data.createdAt);

				setPostData((prevPostData) => ({
					...prevPostData,
					...response.data,
				}));
				setEditablePostData((prevPostData) => ({
					...prevPostData,
					...response.data,
				}));
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchPostData();
	}, []);

	useEffect(() => {
		const fetchReactionNumberData = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:3050/api/posts/${post_id}/like`
				);

				let likeCount = 0;
				let dislikeCount = 0;

				response.data.forEach((reaction) => {
					if (reaction.type === 'like') {
						likeCount += 1;
					} else if (reaction.type === 'dislike') {
						dislikeCount += 1;
					}
				});

				setReactionNumbers({
					like: likeCount,
					dislike: dislikeCount,
				});
			} catch (error) {
				console.error('Error fetching reaction data:', error);
			}
		};

		fetchReactionNumberData();
	}, [reactionData]);

	useEffect(() => {
		const checkFavoriteStatus = async () => {
			try {
				tokenRef.current = Cookies.get('token');

				if (tokenRef.current) {
					const response = await axios.get(
						`http://127.0.0.1:3000/api/favorites/${post_id}`,
						{
							headers: {
								Authorization: `Bearer%20${tokenRef.current}`,
							},
						}
					);

					setIsFavorited(response.data.isFavorited);
				}
			} catch (error) {
				console.error('Error checking favorite status:', error);
			}
		};

		checkFavoriteStatus();
	}, [post_id]);

	const handleUserClick = (ev) => {
		tokenRef.current = Cookies.get('token');
		ev.preventDefault();
		if (postData.author_id == user) {
			navigate(`/user/me`);
		} else if (tokenRef.current) {
			navigate(`/user/${postData.author_id}`);
		} else {
			navigate('/notAuthOrReg');
		}
	};

	const handleReactionClick = async (reactionType) => {
		tokenRef.current = Cookies.get('token');

		try {
			if (tokenRef.current) {
				if (activeButton !== reactionType) {
					if (activeButton) {
						const response = await axios.delete(
							`http://127.0.0.1:3050/api/posts/${post_id}/like`,
							{
								headers: {
									Authorization: `Bearer%20${tokenRef.current}`,
								},
								data: { type: activeButton },
							}
						);
						setReactionData((prevReactionData) => ({
							...prevReactionData,
							...response.data,
						}));
					}
					const response = await axios.post(
						`http://127.0.0.1:3050/api/posts/${post_id}/like`,
						{ type: reactionType },
						{
							headers: {
								Authorization: `Bearer%20${tokenRef.current}`,
							},
						}
					);

					setReactionData((prevReactionData) => ({
						...prevReactionData,
						...response.data,
					}));
				} else {
					const response = await axios.delete(
						`http://127.0.0.1:3050/api/posts/${post_id}/like`,
						{
							headers: {
								Authorization: `Bearer%20${tokenRef.current}`,
							},
							data: { type: reactionType },
						}
					);

					setReactionData((prevReactionData) => ({
						...prevReactionData,
						...response.data,
					}));
				}
				setActiveButton(
					activeButton === reactionType ? null : reactionType
				);
			} else {
				console.log('Unauthorized');
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const handleDeleteClick = async () => {
		tokenRef.current = Cookies.get('token');
		try {
			if (tokenRef.current) {
				const response = await axios.delete(
					`http://127.0.0.1:3050/api/posts/${post_id}`,
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				console.log(response);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleEditClick = () => {
		setEditMode(true);
	};

	const handleSaveClick = async () => {
		try {
			tokenRef.current = Cookies.get('token');
			const response = await axios.patch(
				`http://127.0.0.1:3050/api/posts/${post_id}`,
				editablePostData,
				{
					headers: {
						Authorization: `Bearer%20${tokenRef.current}`,
					},
				}
			);
			console.log(response);
			setEditMode(false);
		} catch (err) {
			console.log(err);
		}
	};

	const handleInputChange = (ev) => {
		const { name, value } = ev.target;
		setEditablePostData((prevData) => ({ ...prevData, [name]: value }));
	};

	const onPostClick = (ev) => {
		ev.preventDefault();
		navigate(`/posts/${postData.post_id}`);
	};

	const isOnMainPage = location.pathname.includes('mainPage');
	const isOnUserPage = location.pathname.includes('user/me');
	const isOnPostPage = location.pathname.includes('posts/');
	const isOnFavoritePage = location.pathname.includes('favorite');

	const handleAddComment = async () => {
		try {
			tokenRef.current = Cookies.get('token');

			if (tokenRef.current && content.trim() !== '') {
				const response = await axios.post(
					`http://127.0.0.1:3050/api/posts/${post_id}/comments`,
					{
						content: content,
					},
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				setContent('');
			} else {
				console.log('Unauthorized or empty comment text');
			}
		} catch (error) {
			console.error('Error adding comment:', error);
		}
	};

	const handleCommentInputChange = (ev) => {
		setContent(ev.target.value);
	};

	const handleToggleFavorite = async () => {
		try {
			tokenRef.current = Cookies.get('token');

			if (tokenRef.current) {
				if (isFavorited) {
					const response = await axios.delete(
						`http://127.0.0.1:3050/api/favorites/${post_id}`,
						{
							headers: {
								Authorization: `Bearer%20${tokenRef.current}`,
							},
						}
					);
				} else {
					const response = await axios.post(
						`http://127.0.0.1:3050/api/favorites/${post_id}`,
						{},
						{
							headers: {
								Authorization: `Bearer%20${tokenRef.current}`,
							},
						}
					);
				}
				setIsFavorited(!isFavorited);
			}
		} catch (error) {
			console.error('Error toggling favorite status:', error);
		}
	};

	const handleRemoveFromFavorites = async () => {
		try {
			tokenRef.current = Cookies.get('token');
			if (tokenRef.current) {
				const response = await axios.delete(
					`http://127.0.0.1:3050/api/favorites/${post_id}`,
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				setIsFavorited(false);
			}
		} catch (error) {
			console.error('Error removing post from favorites:', error);
		}
	};
	

	return (
		<div className="post" onPostClick>
			<div className="post-header">
				<div className="post-author-avatar" onClick={handleUserClick}>
					<Avatar
						profilePicture={postData.postAuthor?.profilePicture}
						altText="User Avatar"
					/>
				</div>
				<div className="post-author">{postData.author}</div>
				<div className="post-creation-date">{postData.createdAt}</div>
			</div>
			<div className="post-consistance">
				<div className="post-title">
					{editMode ? (
						<input
							type="text"
							name="title"
							value={editablePostData.title}
							onChange={handleInputChange}
						/>
					) : (
						postData.title
					)}
				</div>
				<div className="post-content">
					{editMode ? (
						<input
							type="text"
							name="content"
							value={editablePostData.content}
							onChange={handleInputChange}
						/>
					) : (
						postData.content
					)}
				</div>
			</div>
			<div className="rating">
				<div className="like-amount">{reactionNumbers.like}</div>
				<div
					className={`like ${
						activeButton === 'like' ? 'active' : ''
					}`}
					onClick={() => handleReactionClick('like')}
				></div>
				<div className="dislike-amount">{reactionNumbers.dislike}</div>
				<div
					className={`dislike ${
						activeButton === 'dislike' ? 'active' : ''
					}`}
					onClick={() => handleReactionClick('dislike')}
				></div>
			</div>
			{postData.author_id == user && !isOnMainPage && isOnUserPage ? (
				<div className="delete-or-edit-post">
					<div className="delete-post" onClick={handleDeleteClick}>
						delete
					</div>
					{editMode ? (
						<div className="save-post" onClick={handleSaveClick}>
							save
						</div>
					) : (
						<div className="edit-post" onClick={handleEditClick}>
							edit
						</div>
					)}
				</div>
			) : null}
			{isOnPostPage ? (
				<div>
					<input
						type="text"
						placeholder="Type your comment"
						value={content}
						onChange={handleCommentInputChange}
					/>
					<button onClick={handleAddComment}>add comment</button>
				</div>
			) : null}
			{!isOnMainPage && !isOnFavoritePage && (
				<Comments post_id={postData.post_id} />
			)}
			{!isOnPostPage ? (
				<button onClick={onPostClick}>look post</button>
			) : null}
			{isOnMainPage ||
			isOnPostPage ||
			(!isOnFavoritePage && !isOnUserPage) ? (
				<button onClick={handleToggleFavorite}>Fav</button>
			) : null}
			{isOnFavoritePage ? (
				<button onClick={handleRemoveFromFavorites}>
					Remove from favorites
				</button>
			) : null}
		</div>
	);
}

export default Post;
