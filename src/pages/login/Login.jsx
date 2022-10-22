import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.scss";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const [notAuth, setNotAuth] = useState(false);

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  //   Handle Change Function
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  //   Handle Click Function
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      if (res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
        setNotAuth(false);
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { messsage: "You are not allowed" },
        });
        setNotAuth(true);
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          className="lInput"
          placeholder="username"
          id="username"
          onChange={handleChange}
        />
        <input
          type="password"
          className="lInput"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <span>{error.message}</span>}
        {notAuth && <span>You are not allowed to visit Admin Dashboard</span>}
      </div>
    </div>
  );
};

export default Login;
