import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Avatar from './avatar';

function Answers({ comment_id }) {
	const [answerData, setAnswerData] = useState([]);
	const tokenRef = useRef(null);
	console.log(comment_id);

	useEffect(() => {
		const fetchData = async () => {
			tokenRef.current = Cookies.get('token');
			try {
				const answerResponse = await axios.get(
					`http://127.0.0.1:3050/api/comments/${comment_id}/answer`,
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				setAnswerData(answerResponse.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [comment_id]);

	console.log(answerData);
	answerData.map((e) => {
		console.log(e);
	});

	return (
		<div className="answer-block">
			{answerData
				? answerData.map((answer, index) => (
						<div className='answer-div' key={index}>{answer.content}</div>
                ))
				: null}
		</div>
	);
}

export default Answers;
