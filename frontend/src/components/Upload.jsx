import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #00000096;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.textSoft};
  ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.textarea`
  border: 1px solid ${({ theme }) => theme.textSoft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.textSoft};
  color: ${({ theme }) => theme.text};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const handleTags = (e) => {
    setTags((prev) => e.target.value.split(","));
  };

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadFile = async (file, fileType) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setInputs((prev) => ({
        ...prev,
        [fileType]: response.data.fileUrl, // Assuming the backend responds with the file URL
      }));
    } catch (error) {
      console.log(error);
      // Handle error here, maybe show a message to the user
    }
  };

  useEffect(() => {
    if (video) uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    if (img) uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/videos", { ...inputs, tags });
      Swal.fire(
        "Good job!",
        "Video has been uploaded successfully!",
        "success"
      );
      setOpen(false);
      navigate(`/`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error || "Unable to upload video",
      });
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a new video</Title>
        <Label>Video:</Label>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Description
          placeholder="Description"
          rows={8}
          name="description"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate tags with commas"
          onChange={handleTags}
        />
        <Label>Image:</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
