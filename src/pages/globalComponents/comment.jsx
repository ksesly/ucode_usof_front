import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Avatar from './avatar';
import Answers from './answer';

function Comments({ post_id }) {
	const [commentData, setCommentData] = useState([]);
	const [answerData, setAnswerData] = useState([]);
	const tokenRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			tokenRef.current = Cookies.get('token');
			try {
				const commentResponse = await axios.get(
					`http://127.0.0.1:3050/api/posts/${post_id}/comments`,
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);

				setCommentData(commentResponse.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [post_id]);

	console.log(commentData);
	

	return (
		<div className="comments">
			{commentData.map((comment, index) => (
				<div key={index}>
					{comment.content}
					<Answers comment_id={comment.comment_id}/>
				</div>
			))}
		</div>
	);
}

export default Comments;
