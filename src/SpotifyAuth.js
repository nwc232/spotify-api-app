import React from 'react';

const CLIENT_ID = '5de5690a75c14ddcbf960a1def348244';
const REDIRECT_URI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/callback'
    : 'https://spotify-api-app-chi.vercel.app/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

const SpotifyAuth = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <h2>Login to Spotify below to view your top songs</h2>
      <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}
      >
        Login
        </a>
    </div>
  );
}

export default SpotifyAuth;