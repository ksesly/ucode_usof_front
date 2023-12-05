import {
	BrowserRouter as Router,
	Routes,
	Navigate,
	Route,

	// BrowserRouter,
} from 'react-router-dom';

import Register from './pages/auth/register';
import Login from './pages/auth/login';
import MainPage from './pages/mainPage/mainPage';
import CurrentUserPage from './pages/user/currentUserPage';
import UserPage from './pages/user/userPage';
import NotAuthOrReg from './pages/globalComponents/notAuthOrReg';
import AddPost from './pages/globalComponents/addPost';
import PostPage from './pages/post/postPage';
import Favorite from './pages/globalComponents/favorites';
import EditUserPage from './pages/user/editUser';
import About from './pages/about/about';

export const UsofRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/mainPage" />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/mainPage" element={<MainPage />} />
				<Route path="/user/:user_id" element={<UserPage />} />
				<Route path="/user/me" element={<CurrentUserPage />} />
				<Route path="/notAuthOrReg" element={<NotAuthOrReg />} />
				<Route path="/addPost" element={<AddPost />} />
				<Route path="/posts/:post_id" element={<PostPage />} />
				<Route path="/favorites" element={<Favorite />} />
				<Route path="/edit" element={<EditUserPage />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</Router>
	);
};
