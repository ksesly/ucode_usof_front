import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from '../globalComponents/Post';
import Header from '../globalComponents/header';
import '../../style/mainPage.scss';
import '../../style/global.scss';

const PostPage = () => {
    const { post_id } = useParams();
    console.log(post_id)

	return (
		<div className="mainPage">
			<Header />
			<Post post_id={post_id} />
		</div>
	);
};

export default PostPage;
