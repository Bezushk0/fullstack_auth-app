import './styles.scss';

import { useContext, useEffect } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { usePageError } from './hooks/usePageError';
import { AuthContext } from './components/AuthContext';
import { Loader } from './components/Loader';

import { HomePage } from './pages/HomePage';
import { RegistrationPage } from './pages/RegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { AccountActivationPage } from './pages/AccountActivationPage';
import { RequireAuth } from './components/RequireAuth';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/UsersPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { ResetPage } from './pages/ResetPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const navigate = useNavigate();
  const [error, setError] = usePageError();
  const { isChecked, user, logout, checkAuth } = useContext(AuthContext);

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isChecked) {
    return <Loader />
  }

  return (
    <>
      <nav
        className='navbar has-shadow'
        role='navigation'
        aria-label='main navigation'
      >
        <div className='navbar-start'>
          <NavLink to='/' className='navbar-item'>
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink to='/profile' className='navbar-item'>
                Profile
              </NavLink>

              <NavLink to='/users' className='navbar-item'>
                Users
              </NavLink>
            </>
          ) : (
            ''
          )}
        </div>

        <div className='navbar-end'>
          <div className='navbar-item'>
            <div className='buttons'>
              {user ? (
                <button
                  className='button is-light has-text-weight-bold'
                  onClick={() => {
                    logout()
                      .then(() => {
                        navigate("/");
                      })
                      .catch((error) => {
                        setError(error.response?.data?.message);
                      });
                  }}
                >
                  Logout
                </button>
              ) : (
                  <>
                    <Link
                      to='/sign-up'
                      className='button is-light has-text-weight-bold'
                    >
                      Sign up
                    </Link>

                    <Link
                      to='/login'
                      className='button is-success has-text-weight-bold'
                    >
                      Login
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className='section'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='sign-up' element={<RegistrationPage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='activate/:activationToken' element={<AccountActivationPage />} />
            <Route path='/' element={<RequireAuth />}>
              <Route path='profile' element={<ProfilePage />} />
            </Route>
            <Route path='/' element={<RequireAuth />}>
              <Route path='users' element={<UsersPage/>} />
            </Route>
            <Route
              path='reset'
              element={<ResetPage />}
            />
            <Route
              path='reset/:resetToken'
              element={<ChangePasswordPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </section>

        {error && <p className="notification is-danger is-light">{error}</p>}
      </main>
    </>
  )
}

export default App
