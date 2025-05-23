import { useState } from "react";
import { usePageError } from "../hooks/usePageError"
import { Formik, Form, Field } from "formik";
import { authService } from "../services/authService";

import cn from "classnames";
import { Link } from "react-router-dom";

const validateName = (value) => {
    if (value.length < 3) {
        return 'At least 3 characters'
    }
}

const validateEmail = (value) => {
    if (!value) {
        return 'Email is required';
    }

    const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

    if (!emailPattern.test(value)) {
    return "Email is not valid";
  }
};

const validatePassword = (value) => {
    if (!value) {
        return 'Password is required';
    }

    if (value.length < 6) {
        return 'At least 6 characters'
    }
}

export const RegistrationPage = () => {
    const [error, setError] = usePageError('');
    const [registered, setRegistered] = useState(false);

    if (registered) {
        return (
            <section className="">
                <h1 className="title">Check your email</h1>
                <p>We have sent you an email with the activation link</p>
            </section>
        )
    }

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    name: '',
                    password: '',
                }}
                validateOnMount={true}
                onSubmit={({ email, password, name }, formikHelpers) => {
                    formikHelpers.setSubmitting(true);

                    authService
                        .register({ email, password, name })
                        .then(() => {
                            setRegistered(true);
                        })
                        .catch((error) => {
                            console.error('Error during registration:', error);
                            if (error.message) {
                                setError(error.message);
                            }

                            if (!error.response) {
                                setError("Something went wrong. Please try again.");
                                return;
                            }

                            const { status, data } = error.response;

                            if (status === 409) {
                                setError("User with this email already exists");
                                return;
                            }

                            if (data.errors) {
                                formikHelpers.setFieldError("email", data.errors.email);
                                formikHelpers.setFieldError("password", data.errors.password);
                                formikHelpers.setFieldError("name", data.errors.name);
                            }

                            if (data.message) {
                                setError(data.message);
                            }
                        })
                        .finally(() => {
                            formikHelpers.setSubmitting(false);
                        })      
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form className="box">
                        <h1 className="title">Sign up</h1>
                        <div className="field">
                            <label htmlFor="name" className="label">
                                Name
                            </label>

                            <div className="control has-icons-left has-icons-right">
                                <Field
                                    validate={validateName}
                                    name='name'
                                    type='text'
                                    id='name'
                                    placeholder='Name'
                                    className={cn('input', {
                                        'is-danger': touched.name && error.name
                                    })}
                                />

                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>

                                {touched.name && error.name && (
                                    <span className="icon is-small is-right has-text-danger">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                )}
                            </div>

                            {touched.name && errors.name && (
                                <p className="help is-danger">{errors.name}</p>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="email" className="label">
                                Email
                            </label>

                            <div className="control has-icons-left has-icons-right">
                                <Field
                                    validate={validateEmail}
                                    name='email'
                                    type='email'
                                    id='email'
                                    placeholder='vasya@gmail.com'
                                    className={cn('input', {
                                        'is-danger': touched.email && error.email
                                    })}
                                />

                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>

                                {touched.email && error.email && (
                                    <span className="icon is-small is-right has-text-danger">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="password" className="label">
                                Password
                            </label>

                            <div className="control has-icons-left has-icons-right">
                                <Field
                                    validate={validatePassword}
                                    name='password'
                                    type='password'
                                    id='password'
                                    placeholder='********'
                                    className={cn('input', {
                                        'is-danger': touched.password && error.password
                                    })}
                                />

                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>

                                {touched.password && error.password && (
                                    <span className="icon is-small is-right has-text-danger">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                )}

                                {touched.password && errors.password ? (
                                    <p className="help is-danger">{errors.password}</p>
                                ) : (
                                    <p className="help">At least 6 characters</p>
                                )}
                            </div>
                        </div>

                        <div className="field field__btn">
                            <button
                                type="submit"
                                className={cn("button is-success has-text-weight-bold", {
                                    "is-loading": isSubmitting,
                                })}
                                disabled={isSubmitting || errors.email || errors.password}
                            >
                                Sign up
                            </button>
                            Already have an account? <Link to='/login'>Log in</Link>
                        </div>
                    </Form>
                )}
            </Formik>

            {error && <p className="notification is-danger is-light">{error}</p>}
        </>
    )
}