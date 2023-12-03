import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../globalComponents/Post';
import Header from '../globalComponents/header';
import '../../style/mainPage.scss';
import '../../style/global.scss';

const MainPage = () => {
	const [postData, setPostData] = useState({});
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:3050/api/posts?page=${currentPage}`
				);
				setPostData(response.data);
			} catch (error) {
				console.error('Error fetching post data:', error);
			}
		};

		fetchPostData();
	}, [currentPage]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="mainPage">
			<Header />

			{postData.data
				? postData.data.map((post) => (
						<Post key={post.post_id} post_id={post.post_id} />
				  ))
				: null}

			{postData.pagination && (
				<div className="pagination">
					{Array.from(
						{ length: postData.pagination.totalPages },
						(_, index) => (
							<button
								key={index + 1}
								onClick={() => handlePageChange(index + 1)}
								className={
									index + 1 === currentPage ? 'active' : ''
								}
							>
								{index + 1}
							</button>
						)
					)}
				</div>
			)}
		</div>
	);
};

export default MainPage;
