import { useState } from "react";
import { axiosInstance } from "../utils/axiosConfig";  // Use your backend API for authentication
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/signin", { email, password });
      // Assuming the response contains a token or user data
      localStorage.setItem("token", res.data.token);  // Store token in local storage
      navigate("/dashboard");  // Redirect to dashboard after successful login
    } catch (error) {
      Swal.fire("Error", "Invalid credentials, please try again.", "error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSignin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
