import React from 'react';
import '../../style/avatar.scss';

const Avatar = ({ profilePicture, altText }) => {
	const defaultAvatar = "http://127.0.0.1:3050/static/avatars/basic_user.png";
	return (
		<img
			className="avatar"
			src={profilePicture ? `http://127.0.0.1:3050${profilePicture}` : defaultAvatar}
			alt={altText}
		/>
	);
};


export default Avatar;
