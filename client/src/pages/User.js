import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from './helper/ConvertDate'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import './User.css'

function User() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [listOfPosts, setListOfPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/auth/info/${id}`, {
            headers: {
                accessToken: localStorage.getItem('accessToken'),
            }
        }).then((response) => {
            setUserInfo(response.data);
        });
        axios.get(`http://localhost:3001/posts/byUserId/${id}`, {
            headers: {
                accessToken: localStorage.getItem('accessToken'),
            }
        }).then((response) => {
            setListOfPosts(response.data.reverse());
        });
    }, []);

    return (
        <div className='user-page'>
            <div className='user-info-container'>
                <table className='user-table'>
                    <tr className='user-row'>
                        <td className='user-row-component' id='user-username-label'>User</td>
                        <td className='user-row-component' id='user-username'>{userInfo.username}</td>
                    </tr>
                    <tr>
                        <td className='user-row-component'>Created</td>
                        <td className='user-row-component'>{formatDate(userInfo.createdAt)}</td>
                    </tr>
                </table>
            </div>
            <div className='post-container'>
                {listOfPosts.map((post, key) => {
                    return <div className='post' key={key} >
                        <p className='post-title' onClick={() => { navigate(`/post/${post.id}`); }}>{post.title}</p>
                        <div className='post-content'>
                            <div className='post-text-container'>
                                <p className='post-text'>{post.postText}</p>
                            </div>
                            <div className='post-image-container'>
                                {post.image &&
                                    <img src={`http://localhost:3001/uploads/${post.image}`} className='post-image'></img>
                                }
                            </div>
                        </div>
                        <div className='post-footer'>
                            <p className='user-post-user' >{post.username}</p>
                            <p className='post-date'>{formatDate(post.createdAt)}</p>
                            <p className='likes-number'>{post.Likes.length}</p>
                            <ThumbUpIcon
                                style={{ fontSize: '2vw' }}
                                className="user-like-button" />
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default User
