import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../globalComponents/Post";
import Header from "../globalComponents/header";
import "../../style/mainPage.scss";
import "../../style/global.scss";
import { useNavigate } from "react-router-dom";

const About = () => {
    return (
        <div className="about-page">
            <Header />
        </div>
    );
};

export default About;
