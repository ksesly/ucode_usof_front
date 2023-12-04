import '../../style/post.scss';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Avatar from './avatar';

function Post({ post_id }) {
	const [postData, setPostData] = useState({});
	const [reactionData, setReactionData] = useState({});
	const [reactionNumberData, setReactionNumberData] = useState({});
	const [activeButton, setActiveButton] = useState(null);
	const [reactionNumbers, setReactionNumbers] = useState({
		like: 0,
		dislike: 0,
	});
	const tokenRef = useRef(null);
	const navigate = useNavigate();

	const getTime = (time) => {
		const dateString = '2023-11-24T22:17:03.000Z';
		const dateObject = new Date(dateString);
		const formattedDate = dateObject.toISOString().split('T')[0];
		return formattedDate;
	};

	useEffect(
		() => {
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
				} catch (error) {
					console.error('Error fetching user data:', error);
				}
			};

			fetchPostData();
		},
		[
			// 	// postData, post_id.post_id
		]
	);

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

	const handleUserClick = (ev) => {
		tokenRef.current = Cookies.get('token');
		ev.preventDefault();
		if (tokenRef.current) {
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

	return (
		<div className="post">
			<div className="post-header">
				<div className="post-author-avatar">
					<Avatar
						profilePicture={postData.postAuthor?.profilePicture}
						altText="User Avatar"
					/>
				</div>
				<div className="post-author">{postData.author}</div>
				<div className="post-creation-date">{postData.createdAt}</div>
			</div>
			<div className="post-consistance">
				<div className="post-title">{postData.title}</div>
				<div className="post-content">{postData.content}</div>
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
		</div>
	);
}

export default Post;
