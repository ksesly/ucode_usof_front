import React from 'react';
import '../../style/avatar.scss';

const Avatar = ({ profilePicture, altText }) => {
	return (
		<img
			className="avatar"
			src={`http://127.0.0.1:3050${profilePicture}`}
			alt={altText}
		/>
	);
};

export default Avatar;
