import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from './helper/ConvertDate';
import SearchBar from '../components/SearchBar.js';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      console.log(authState.status)
      navigate('/login');
    } else {
      axios.get("http://localhost:3001/posts", {
        headers: {
          accessToken: localStorage.getItem('accessToken')
        }
      }
      ).then((response) => {
        setListOfPosts(response.data.listOfPosts.reverse());
        setLikedPostIds(response.data.likedPosts.map((likedPost) => {
          return likedPost.PostId;
        }));
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
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === postId) {
          if (response.data.liked) {
            return { ...post, Likes: [...post.Likes, 0] };
          } else {
            return { ...post, Likes: post.Likes.slice(0, -1) };
          }
        } else {
          return post
        }
      }));
      if (likedPostIds.includes(postId)) {
        setLikedPostIds(likedPostIds.filter((id) => {
          return id !== postId;
        }))
      } else {
        setLikedPostIds([...likedPostIds, postId]);
      }
    });
  };

  return (
    <div className='post-container'>
      {listOfPosts.length !== 0 &&
        <div className='search-bar-container'>
          <SearchBar placeholder='Enter word ...' data={listOfPosts} setData={setListOfPosts} />
        </div>
      }
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
            <p className='post-user' onClick={() => { navigate(`/user/${post.UserId}`); }}>{post.username}</p>
            <p className='post-date'>{formatDate(post.createdAt)}</p>
            <p className='likes-number'>{post.Likes.length}</p>
            <ThumbUpIcon
              style={{ fontSize: '2vw' }}
              onClick={() => {
                likeAPost(post.id);
              }}
              className={likedPostIds.includes(post.id) ? "unlike-button" : "like-button"} />
          </div>
        </div>
      })}
    </div>
  );
}

export default Home;