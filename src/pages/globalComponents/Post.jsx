import "../../style/post.scss";
import React, { useState, useEffect, useRef  } from "react";
import axios from "axios";
import Avatar from "./avatar";

function Post(post_id) {
    // console.log(post_id);
    const [postData, setPostData] = useState({});
	const [authorData, setAuthorData] = useState({});
    const [activeButton, setActiveButton] = useState(null);
    const tokenRef = useRef(null);

    const getTime = (time) => {
        const dateString = "2023-11-24T22:17:03.000Z";
        const dateObject = new Date(dateString);
        const formattedDate = dateObject.toISOString().split("T")[0];
        return formattedDate;
    };

    useEffect(
        () => {
            const fetchPostData = async () => {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:3050/api/posts/${post_id.post_id}`,
                        {}
                    );
                    response.data.createdAt = getTime(response.data.createdAt);

                    setPostData((prevPostData) => ({
                        ...prevPostData,
                        ...response.data,
                    }));
                    // console.log('little post', postData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchPostData();
        },
        [
            // 	// postData, post_id.post_id
        ]
    );

	console.log(postData);


    useEffect(
        () => {
            const fetchAuthorData = async () => {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:3050/api/users/${postData.author_id}`,
                        {}
                    );

                    setAuthorData((prevAuthorData) => ({
                        ...prevAuthorData,
                        ...response.data,
                    }));
                    // console.log('little post', postData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchAuthorData();
        },
        [
            
        ]
    );
    
    
	console.log(authorData);

    // const handleUserClick = (ev) => {
    //     tokenRef.current = Cookies.get("token");
    //     ev.preventDefault();
    //     if (tokenRef.current) {
    //         navigate(`/user/${postData.author_id}`);
    //     } else {
    //         navigate("/notAuthOrReg");
    //     }
    // };

    // TODO
    const handleReactionClick = (type) => {
        setActiveButton(type);
    };

    return (
        <div className="post">
            <div className="post-header">
                <div className="post-author-avatar">
                    {/* <Avatar
                        profilePicture={userData.profilePicture}
                        altText="User Avatar"
                    /> */}
                </div>
                <div className="post-author">{postData.author}</div>
                <div className="post-creation-date">{postData.createdAt}</div>
            </div>
            <div className="post-consistance">
                <h1 className="post-title">{postData.title}</h1>
                <div className="post-content">{postData.content}</div>
            </div>
            <div className="rating">
                <div
                    className={`like ${
                        activeButton === "like" ? "active" : ""
                    }`}
                    onClick={() => handleReactionClick("like")}
                ></div>
                <div
                    className={`dislike ${
                        activeButton === "dislike" ? "active" : ""
                    }`}
                    onClick={() => handleReactionClick("dislike")}
                ></div>
            </div>
        </div>
    );
}

export default Post;
