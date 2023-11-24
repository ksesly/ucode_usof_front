import '../../style/post.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Post(post_id) {
	// console.log(post_id);
	const [postData, setPostData] = useState({});

	const getTime = (time) => {
		const dateString = '2023-11-24T22:17:03.000Z';
		const dateObject = new Date(dateString);
		const formattedDate = dateObject.toISOString().split('T')[0];
		return formattedDate;
	};

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:3050/api/posts/${post_id.post_id}`,
					{}
				);
				response.data.createdAt = getTime(response.data.createdAt);

				setPostData((prevPostData) => ({
					...prevPostData,
					...response.data,
				}));
				console.log('little post', postData);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchPostData();
	}, []);

	return (
		<div className="post">
			<div className="post-header">
				<div className="post-avatar"></div>
				<div className="post-author">{postData.author}</div>
				<div className="post-creation-date">{postData.createdAt}</div>
			</div>
			<div className="post-consistance">
				<h1 className="post-title">{postData.title}</h1>
				<div className="post-content">{postData.content}</div>
			</div>
		</div>
	);
}

export default Post;
