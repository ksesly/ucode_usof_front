import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Post from '../globalComponents/Post';
import Header from '../globalComponents/header';
import '../../style/mainPage.scss';
import '../../style/global.scss';
import Cookies from 'js-cookie';

const Favorite = () => {
	const [favPostData, setFavPostData] = useState([]);
	const tokenRef = useRef(null);

	useEffect(() => {
		const fetchFavData = async () => {
			tokenRef.current = Cookies.get('token');
			try {
				const response = await axios.get(
					`http://127.0.0.1:3050/api/favorites`,
					{
						headers: {
							Authorization: `Bearer%20${tokenRef.current}`,
						},
					}
				);
				setFavPostData(response.data);
			} catch (error) {
				console.error('Error fetching post data:', error);
			}
		};

		fetchFavData();
	}, []);

	console.log(favPostData);

	return (
		<div className="fav">
			<Header />
			<div className="favorite-posts">
				{favPostData.data
					? favPostData.data.map((post) => (
							<Post key={post.post_id} post_id={post.post_id} />
					  ))
					: null}
			</div>
		</div>
	);
};

export default Favorite;
