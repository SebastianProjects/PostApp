import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css'


function Header({ setTheme }) {
    const { authState, setAuthState } = useContext(AuthContext);

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({
            username: "",
            id: 0,
            status: false,
        });
        navigate('/login');
    };

    return (
        <div className='header-container'>
            <div className='header-pages-container'>
                <Link to="/" className='header-link'>Home</Link>
                {authState.status &&
                    <Link to="/createpost" className='header-link'>Create</Link>
                }
            </div>
            <div className='header-login-container'>
                {authState.status ? (
                    <>
                        <p className='logged-username' onClick={() => { navigate(`/user/${authState.id}`); }}>{authState.username}</p>
                        <button className='logout-button' onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" className='login-link' >Login</Link>
                )}
            </div>
        </div>
    )
}

export default Header;