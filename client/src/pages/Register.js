import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'

function Register() {
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(24).required(),
    password: Yup.string().min(8).max(24).required()
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth/register", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        navigate('/');
      }
    });
  }
  return (
    <div className='register-container'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='form-container'>
          <label className='form-component'>Username</label>
          <ErrorMessage name="username" component="span" className='err' />
          <Field className='form-component' id="create-post-input" name="username" placeholder="John ..." />
          <label className='form-component'>Password</label>
          <ErrorMessage name="password" component="span" className='err' />
          <Field className='form-component' id="create-post-input" name="password" placeholder="Password ..." type="password" />
          <button className='form-component' type='submit' id='form-button'>Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Register
