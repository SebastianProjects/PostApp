import React, { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'

function SearchBar({ placeholder, data, setData }) {
    const [originData, _blank] = useState(data);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState('');

    const navigate = useNavigate();

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        const newFilter = originData.filter((value) => {
            return value.title.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setData(originData);
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
        setWordEntered(searchWord);
    };

    const searchData = () => {
        if (filteredData.length !== 0) {
            setData(filteredData);
        } else {
            setData([{postText: 'Nothing was found', postId: 0, username: '', Likes: []}])
        }
    }

    const clearInput = () => {
        setWordEntered('');
        setData(originData);
        setFilteredData([]);
    };

    return (
        <div className='search-bar'>
            <div className='search-input'>
                <SearchIcon sx={{ fontSize: '2vw' }} className='search-icon' onClick={() => {
                    searchData();
                }} />
                <input type="text" placeholder={placeholder} className='text-input' value={wordEntered} onChange={handleFilter}></input>
                <ClearIcon sx={{ fontSize: '2vw' }} className='clear-icon' onClick={() => {
                    clearInput();
                }} />
            </div>
            {filteredData.length !== 0 && (
                <div className='data-result'>
                    {filteredData.map((value, key) => {
                        return <button className='data-item' target='_blank' onClick={() => { navigate(`/post/${value.id}`) }}>{value.title}</button>
                    })}
                </div>
            )}
        </div>
    )
}

export default SearchBar;
