import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// components & pages import
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
function App() {
  // call refresh endpoint
  // const loading = false;
  const { loading } = useLoadingWithRefresh();
  return loading ? (
    <Loader message="Loading, please wait..." />
  ) : (
    <Router>
      <Navigation />
      <Routes>
        {/* Guest Area */}
        <Route exact path="/" element={<GuestRoute element={<Home />} />} />
        <Route
          path="/authenticate"
          element={<GuestRoute element={<Authenticate />} />}
        />
        {/* Semi-protected Route */}
        <Route
          path="/activate"
          element={<SemiProtectedRoute element={<Activate />} />}
        />
        {/* Protected Route */}
        <Route path="/rooms" element={<ProtectedRoute element={<Rooms />} />} />
        <Route exact path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

// GuestRoute component
export const GuestRoute = ({ element }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return isAuth ? <Navigate to="/rooms" /> : element;
};

// Semi-Protected component
export const SemiProtectedRoute = ({ element }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    element
  ) : (
    <Navigate to="/rooms" />
  );
};

// Protected component
export const ProtectedRoute = ({ element }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  console.log(user);
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    element
  );
};

export default App;
