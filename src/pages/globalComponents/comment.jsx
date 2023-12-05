import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Avatar from './avatar';
import Answers from './answer';

function Comments({ post_id }) {
	const [commentData, setCommentData] = useState([]);
	const [answerText, setAnswerText] = useState('');
	const [replyingCommentId, setReplyingCommentId] = useState(null);
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

	const handleAddAnswer = async (e) => {
		try {
			tokenRef.current = Cookies.get('token');

			if (tokenRef.current && answerText.trim() !== '') {
				const response = await axios.post(
					`http://127.0.0.1:3050/api/comments/${commentData.comment_id}/answer`,
					{
						content: answerText,
					},
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				setAnswerText('');
				setReplyingCommentId(null);
			} else {
				console.log('Unauthorized or empty answer text');
			}
		} catch (error) {
			console.error('Error adding answer:', error);
		}
	};

	const handleAnswerInputChange = (ev) => {
		setAnswerText(ev.target.value);
	};

	const handleReplyButtonClick = (commentId) => {
		setReplyingCommentId(commentId);
	};

	return (
		<div className="comments">
			{commentData.map((comment, index) => (
				<div key={index}>
					{comment.content}
					<Answers comment_id={comment.comment_id} />
					<div>
						{replyingCommentId === comment.comment_id ? (
							<form
								onSubmit={handleAddAnswer}
							>
								<input
									type="text"
									placeholder="Type your answer"
									value={answerText}
									onChange={handleAnswerInputChange}
								/>
								<button type="submit">send</button>
							</form>
						) : (
							<button
								onClick={() => window.location.reload()}
							>
								Reply
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default Comments;
