import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/header.scss';

const HeaderForCurrentUser = () => {
	const [scrollDirection, setScrollDirection] = useState('scroll-up');
	const navigate = useNavigate();

	useEffect(() => {
		const handleScroll = () => {
			const currentScroll = window.pageYOffset;
			if (currentScroll > lastScroll) {
				setScrollDirection('scroll-down');
			} else {
				setScrollDirection('scroll-up');
			}
			lastScroll = currentScroll;
		};

		let lastScroll = window.pageYOffset;
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	const goToMainPage =  async (ev) => {
		ev.preventDefault();
		navigate(`/mainPage`);
	}

	return (
		<div className={`header ${scrollDirection}`}>
			<div className="header-field logo" onClick={goToMainPage}>for name and camp photo</div>
			<div className="right-part-header">
				<div className="header-field search-bar">for find bar</div>
				<div className="header-field avatar-login">
				</div>
			</div>
		</div>
	);
};

export default HeaderForCurrentUser;
