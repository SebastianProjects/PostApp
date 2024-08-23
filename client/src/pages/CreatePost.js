import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import './CreatePost.css'
import * as Yup from 'yup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  let navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
    image: null,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(5).max(50).required(),
    postText: Yup.string().min(5).max(4000).required(),
    image: Yup.mixed().nullable()
    .test(
      "fileSize",
      "File size is too large. Maximum size is 5MB",
      value => !value || (value && value.size <= 5 * 1024 * 1024) // 5MB limit
    )
    .test(
      "fileType",
      "Unsupported file format. Only JPEG and PNG are allowed",
      value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
    ),
  });

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [])

  const onSubmit = (data) => {
    console.log(data)
    axios.post("http://localhost:3001/posts", data, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data',
      }
    }).then((response) => {
      if (response.data.error) {
        alert(response.data.error)
      } else {
        alert("Succesfully created post!");
        navigate('/');
      }
    });
  }

  const handleFileChange = (setFieldValue, event) => {
    setFieldValue("image", event.currentTarget.files[0]);
  };

  return (
    <div className='create-post-container'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ setFieldValue }) => (
          <Form className='form-container'>
            <label className='form-component'>Title</label>
            <ErrorMessage name="title" component="span" className='err' />
            <Field className='form-component' id="create-post-input" name="title" placeholder="My first post about ..." />
            <label className='form-component'>Post</label>
            <ErrorMessage name="postText" component="span" className='err' />
            <Field className='form-component' id="create-post-input" name="postText" placeholder="This post is about ..." />

            <label className='form-component'>Image</label>
            <ErrorMessage name="image" component="span" className='err' />
            <input
              type="file"
              className='form-component'
              id="create-post-image"
              name="image"
              accept="image/*"
              onChange={(event) => handleFileChange(setFieldValue, event)}
            />

            <button className='form-component' type='submit' id='form-button'>Create</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePost;
