import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Answers from './answer';
import { useNavigate } from 'react-router-dom';
import AnswerArrow from '../../assets/icons/back-arrow.png';
import '../../style/post.scss';

function Comments({ post_id }) {
	const [commentData, setCommentData] = useState([]);
	const [answerText, setAnswerText] = useState('');
	const [replyingCommentId, setReplyingCommentId] = useState(null);
	const tokenRef = useRef(null);
	const user = Cookies.get('user');
	const navigate = useNavigate();

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

	const handleAddAnswer = async (commentId) => {
		console.log(answerText);
		try {
			tokenRef.current = Cookies.get('token');

			if (tokenRef.current && answerText.trim() !== '') {
				const response = await axios.post(
					`http://127.0.0.1:3050/api/comments/${commentId}/answer`,
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

	const handleUserClick = (ev) => {
		tokenRef.current = Cookies.get('token');
		ev.preventDefault();
		if (commentData.author_id == user) {
			navigate(`/user/me`);
		} else if (tokenRef.current) {
			navigate(`/user/${commentData.author_id}`);
		} else {
			navigate('/notAuthOrReg');
		}
	};

	return (
		<div className="comments">
			{commentData.map((comment, index) => (
				<div className="comment-answer-div" key={index}>
					<div className="comment-div">
						<div
							className="comment-author-login"
							onClick={handleUserClick}
						>
							{comment.author}{' '}
						</div>
						<div className="comment-author-content">
							{comment.content}{' '}
						</div>
						{replyingCommentId === comment.comment_id ? (
							<div className='answer-form'>
								<input
									className="input-for-answer"
									type="text"
									placeholder="Type your answer"
									value={answerText}
									onChange={handleAnswerInputChange}
								/>
								<button
									className="button-to-send-answer"
									onClick={() =>
										handleAddAnswer(comment.comment_id)
									}
								>
									send
								</button>
							</div>
						) : (
							<div className='div-for-answer-arrow'>
								<img
									className="button-for-answer"
									src={AnswerArrow}
									onClick={() =>
										handleReplyButtonClick(
											comment.comment_id
										)
									}
								/>
							</div>
						)}
					</div>

					<div className="answer-form"></div>
					<div className="comment-line"> </div>
					<Answers comment_id={comment.comment_id} />
					<div className="comment-line"> </div>
				</div>
			))}
		</div>
	);
}

export default Comments;
