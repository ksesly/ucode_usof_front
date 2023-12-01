import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../globalComponents/Post';
import Header from '../globalComponents/header';
import '../../style/mainPage.scss';
import '../../style/global.scss';

const MainPage = () => {
	const [postData, setPostData] = useState({});

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const response = await axios.get(
					'http://127.0.0.1:3050/api/posts'
				);
				setPostData(response.data);
				console.log(postData);
			} catch (error) {
				console.error('Error fetching post data:', error);
			}
		};

		fetchPostData();
	}, [
		// postData
	]);

	return (
		<div className="mainPage">
			<Header />

			{postData.data
				? postData.data.map((post) => (
						<Post key={post.post_id} post_id={post.post_id} />
				  ))
				: null}
		</div>
	);
};

export default MainPage;
