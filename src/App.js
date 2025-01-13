import { useState, useEffect } from 'react';
import SpotifyAuth from './SpotifyAuth';
import axios from 'axios';
import './App.css';

const App = () => {

  const [token, setToken] = useState('');
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  }

  useEffect(() => {
    if (token) {
      axios
        .get('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTopTracks(response.data.items);
        })
        .catch((error) => console.error('Error fetching top tracks:', error));
    }
  }, [token]);

  return (
    <div className="App">
      {!token ? (
        <SpotifyAuth />
      ) : (
      <div>
      <h1>Welcome to my Spotify App!</h1>
      <button onClick={logout}>Logout</button>
      <h2>Your Top Tracks!</h2>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id}>
            <img
            src={track.album.images[0]?.url}
            alt={track.name}
            style={{width: '50px', height: '50px', marginRight: '10px'}}
            />
            {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
    )}
    </div>
  );
}

export default App;
