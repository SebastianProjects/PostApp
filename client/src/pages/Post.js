import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Post.css'
import arrowUp from './assets/arrow-drop-up.png'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { formatDate } from './helper/ConvertDate';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Post() {
  let { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { authState } = useContext(AuthContext);
  const [likedPost, setLikedPost] = useState(false);
  const [likes, setLikes] = useState();

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      console.log(authState.status)
      navigate('/login');
    } else {
      axios.get(`http://localhost:3001/posts/byId/${id}`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        }
      }).then((response) => {
        setPost(response.data.post);
        setLikes(response.data.post.Likes.length);
        if (response.data.liked) {
          setLikedPost(true);
        } else {
          setLikedPost(false);
        }
      });
      axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
        setComments(response.data.reverse());
      });
    }
  }, []);


  const likeAPost = (postId) => {
    axios.post('http://localhost:3001/likes/',
      { PostId: postId },
      {
        headers: {
          accessToken: localStorage.getItem('accessToken')
        }
      }
    ).then((response) => {
      setPost(() => {
        if (post.id === postId) {
          if (response.data.liked) {
            setLikedPost(true);
            setLikes(likes + 1);
            return { ...post, Likes: [...post.Likes, 0] };
          } else {
            setLikedPost(false);
            setLikes(likes - 1);
            return { ...post, Likes: post.Likes.slice(0, -1) };
          }
        } else {
          return post
        }
      });
    });
  };

  const addComment = () => {
    if (newComment) {
      axios.post("http://localhost:3001/comments", {
        commentContent: newComment, PostId: id
      },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          }
        })
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error)
          } else {
            const commentToAdd = { commentContent: newComment, username: response.data.username, id: response.data.id, createdAt: response.data.createdAt };
            setComments([commentToAdd, ...comments]);
            setNewComment('');
          }
        });
    }
  };

  const deleteComment = (commentId) => {
    axios.delete(`http://localhost:3001/comments/${commentId}`,
      {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        }
      }
    ).then((response) => {
      setComments(comments.filter((val) => {
        return val.id !== commentId;
      }));
    });
  }

  const deletePost = (postId) => {
    const answer = window.confirm('Are you sure you want delete this post?');
    if (answer) {
      axios.delete(`http://localhost:3001/posts/byId/${postId}`,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          }
        }
      ).then((response) => {
        navigate('/')
      });
    }
  }

  return (
    <div className='post-page'>
      <div className='post-section'>
        {authState.username === post.username &&
          <HighlightOffIcon
            style={{ fontSize: '2vw' }}
            className='post-delete-button'
            onClick={() => deletePost(post.id)} />
        }
        <div className='one-post-title'>{post.title}</div>
        <div className='one-post-content'>
            <div className='one-post-text-container'>
              <p className='one-post-text'>{post.postText}</p>
            </div>
            <div className='one-post-image-container'>
              {post.image &&
                <img src={`http://localhost:3001/uploads/${post.image}`} className='one-post-image'></img>
              }
            </div>
          </div>
        <div className='one-post-footer'>
          <p className='one-post-user' onClick={() => { navigate(`/user/${post.UserId}`); }}>{post.username}</p>
          <p className='one-post-date'>{formatDate(post.createdAt)}</p>
          <p className='one-post-likes-number'>{likes}</p>
          <ThumbUpIcon
            style={{ fontSize: '2vw' }}
            onClick={() => {
              likeAPost(post.id);
            }}
            className={likedPost ? "unlike-button" : "like-button"} />
        </div>
      </div>
      <div className='comment-section'>
        <div className='add-comment-container'>
          <input type='text' placeholder='Write a comment ...' value={newComment} autoComplete='off' className='add-comment-input' onChange={(event) => { setNewComment(event.target.value) }}></input>
          <button className='add-comment-button' onClick={addComment}>Add</button>
        </div>
        <div className='comments-container'>
          {comments.map((comment, key) => {
            return <div className='comment-with-arrow-container' key={key}>
              <img src={arrowUp} alt='' className='arrow-up-image'></img>
              <div className='comment-container'>
                {authState.username === comment.username &&
                  <HighlightOffIcon
                    style={{ fontSize: '2vw' }}
                    className='comment-delete-button'
                    onClick={() => deleteComment(comment.id)} />
                }
                <div className='grid-container'>
                  <p className='comment-content'>{comment.commentContent}</p>
                  <p className='comment-date'>{formatDate(comment.createdAt)}</p>
                  <p className='comment-user'>{comment.username}</p>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
