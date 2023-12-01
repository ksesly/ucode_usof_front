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
import UserPage from './pages/user/userPage';

export const UsofRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/mainPage" />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/mainPage" element={<MainPage />} />
				<Route path="/userPage" element={<UserPage />} />
			</Routes>
		</Router>
	);
};
