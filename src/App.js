import { useState, useEffect } from 'react';
import SpotifyAuth from './SpotifyAuth';
import axios from 'axios';
import './App.css';

const App = () => {

  const [token, setToken] = useState('');
  const [data, setData] = useState([]);
  const [view, setView] = useState('tracks');

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
      let endpoint = '';
      switch (view) {
        case 'tracks':
          endpoint = 'https://api.spotify.com/v1/me/top/tracks';
          break;
        case 'artists':
          endpoint = 'https://api.spotify.com/v1/me/top/artists';
          break;
        default:
          endpoint = 'https://api.spotify.com/v1/me/top/tracks';
      }
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.items);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [token, view]);

  return (
    <div className="App">
      {!token ? (
        <SpotifyAuth />
      ) : (
      <div>
      <h1>Welcome to my Spotify App!</h1>
      <button onClick={logout}>Logout</button>

      <div style={{ margin: '20px 0'}}>
        <button onClick={() => setView('tracks')}>Top Songs</button>
        <button onClick={() => setView('artists')}>Top Artists</button>
      </div>
      <h2>Your Top {view === 'tracks' ? 'Songs' : 'Artists'}!</h2>
      <ul>
        {view === 'tracks' &&
          data.map((track) => (
            track.album?.images?.[0] ? (
            <li key={track.id}>
              <img
                src={track.album.images[0]?.url || 'https://via.placeholder.com/100'}
                alt={track.name}
                style={{ width: '100px', height: '100px', marginRight: '10px' }}
              />
              {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
            </li>
            ) : null
          ))}
        
        {view === 'artists' &&
          data.map((artist) => (
            artist.images?.[0] ? (
            <li key={artist.id}>
              <img
                src={artist.images?.[0]?.url || 'https://via.placeholder.com/100'}
                alt={artist.name}
                style={{ width: '100px', height: '100px', marginRight: '10px' }}
              />
              {artist.name}
            </li>
          ) : null
          ))}
      </ul>
    </div>
    )}
    </div>
  );
}

export default App;
