import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/header.scss";
import axios from "axios";
import Cookies from "js-cookie";

const HeaderForCurrentUser = () => {
    const [scrollDirection, setScrollDirection] = useState("scroll-up");
    const navigate = useNavigate();
    const tokenRef = useRef(null);
	const tok =  Cookies.get('token');

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll) {
                setScrollDirection("scroll-down");
            } else {
                setScrollDirection("scroll-up");
            }
            lastScroll = currentScroll;
        };

        let lastScroll = window.pageYOffset;
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const goToMainPage = async (ev) => {
        ev.preventDefault();
        navigate(`/mainPage`);
    };

    const handleLogOut = async () => {
        try {
            tokenRef.current = Cookies.get("token");
            const token = tokenRef.current;

            if (token) {
                console.log("Token exists:", token);
                const response = await axios.post(
                    "http://127.0.0.1:3050/api/auth/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer%20${token}`,
                        },
                    }
                );
                console.log(response);
                navigate('/mainPage');
                Cookies.remove("token");
            } else {
                console.log("Token does not exist");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const handleFavClick = () => {
		navigate('/favorites');
	};

    const goToAboutPage = () => {
		navigate('/about');
	};


    return (
        <div className={`header ${scrollDirection}`}>
            <div className="header-field logo" onClick={goToMainPage}>
				<img
					className="campus-img"
					src={
						 `http://127.0.0.1:3050/static/avatars/campus.png`
					}
					alt={'campus!'}
				/>
                <div>Campwers</div>
			</div>
            <button className='go-to-mainpage-button' onClick={goToMainPage}>Main Page</button>
			{tok ? <button className='go-to-fav-button' onClick={handleFavClick}>fav</button> : null}
			<button className='go-to-about-button' onClick={goToAboutPage}>About</button>
            <div className="right-part-header">
                {/* <div className="header-field search-bar">for find bar</div> */}
                <div className="header-field avatar-login"></div>
            </div>
            {tok ? <button className="logout-button" onClick={handleLogOut}>Log Out</button> : null}
        </div>
    );
};

export default HeaderForCurrentUser;
