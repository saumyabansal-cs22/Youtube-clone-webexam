import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { signupError, signupStart, signupSuccess } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import UploadProfileImage from "../components/UploadProfileImage";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 83vh;
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 50px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.softHr};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.sidebarBg};
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.softHr};
  padding: 10px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const SignUpButton = styled.button`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.softHr};
  padding: 10px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.softHr};
  outline: none;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (name.length === 0 || email.length === 0 || password.length === 0 || !img) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide name, email, password & profile image to signup",
      });
      return;
    }
    dispatch(signupStart());
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
        img: imgUrl,
      });
      dispatch(signupSuccess(res.data.user));
      Swal.fire(`Welcome ${res.data?.user.name}`, "Sign up Successful!", "success");
      navigate(`/`);
    } catch (error) {
      console.log(error);
      dispatch(signupError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error || "Error occurred during signup",
      });
    }
  };

  // Handle Google Sign-up
  const handleGoogleLogin = (response) => {
    const { tokenId } = response;
    dispatch(signupStart());
    try {
      axiosInstance
        .post("/auth/google", { tokenId }) // Send tokenId to your backend to verify
        .then((res) => {
          // Store the JWT token returned by the backend
          localStorage.setItem("authToken", res.data.token);
          dispatch(signupSuccess(res.data.user));
          Swal.fire(`Welcome ${res.data?.user.name}`, "Sign up Successful!", "success");
          navigate(`/`);
        })
        .catch((error) => {
          console.log(error);
          dispatch(signupError());
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error occurred during Google sign-up",
          });
        });
    } catch (error) {
      console.log(error);
      dispatch(signupError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error occurred during Google sign-up",
      });
    }
  };

  const handleGoogleFailure = (error) => {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Google Sign-up failed. Please try again.",
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Wrapper>
        <Title>Create your account</Title>
        <Input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <UploadProfileImage
          img={img}
          setImg={setImg}
          imgPerc={imgPerc}
          setImgUrl={setImgUrl}
          setImgPerc={setImgPerc}
        />
        {imgPerc > 0 && <p>Uploading Image: {imgPerc}%</p>}
        <SignUpButton onClick={handleSignup}>Sign up</SignUpButton>
        <span>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "inherit" }}>
            Signin
          </Link>
        </span>
        <span>OR</span>
        {/* Google Sign-In Button */}
        <div
          className="g-signin2"
          data-onsuccess="handleGoogleLogin"
          data-theme="dark"
        ></div>
      </Wrapper>
    </Container>
  );
};

export default Signup;
