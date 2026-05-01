# 🎵 Telegram Music WebApp

A Spotify-like music streaming application integrated into Telegram WebApp interface.

## Features

✅ **Music Playback** - Play, pause, skip, volume control  
✅ **Search & Filter** - Find songs by title, artist, genre  
✅ **Favorites System** - Like and save favorite tracks  
✅ **Playlists** - Create, manage, and share playlists  
✅ **User Profiles** - Track listening history & statistics  
✅ **Spotify-like UI** - Modern dark theme with green accents  
✅ **Telegram Integration** - Full WebApp support  
✅ **Authentication** - JWT tokens + Telegram login  
✅ **Responsive Design** - Works on all devices  
✅ **MongoDB Support** - Persistent data storage  

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for production)
- Telegram Bot Token

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nomadbeats/Miniapp.git
   cd Miniapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env:**
   ```dotenv
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   WEB_APP_URL=https://yourdomain.com/app
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the app:**
   - Web: http://localhost:3000
   - Telegram: Add bot to Telegram and open WebApp

## API Endpoints

### Music API
- `GET /api/music` - Get all tracks
- `GET /api/music/:id` - Get track by ID
- `GET /api/search?q=query` - Search tracks
- `GET /api/genre/:genre` - Get tracks by genre
- `GET /api/top` - Get top tracks

### Authentication API
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/telegram-login` - Telegram login

### Playlist API
- `POST /api/playlist` - Create playlist
- `GET /api/playlist` - Get all playlists
- `GET /api/playlist/:id` - Get playlist by ID
- `POST /api/playlist/:id/tracks` - Add track to playlist
- `DELETE /api/playlist/:id/tracks/:trackId` - Remove track

### User API
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile
- `GET /api/users/:userId/favorites` - Get favorites

## Project Structure

```
Miniapp/
├── public/
│   ├── index.html          # Main HTML
│   ├── styles.css          # CSS styles
│   ├── app.js              # Player logic
│   └── telegram-utils.js   # Telegram integration
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── music.js            # Music routes
│   ├── playlist.js         # Playlist routes
│   └── users.js            # User routes
├── models/
│   ├── User.js             # User schema
│   ├── Track.js            # Track schema
│   └── Playlist.js         # Playlist schema
├── config/
│   └── database.js         # Database setup
├── index.js                # Main server
├── package.json            # Dependencies
├── .env.example            # Environment template
└── README.md               # Documentation
```

## Telegram Bot Setup

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Set WebApp URL in bot settings
4. Add token to .env file
5. Set webhook for your bot (production only)

## Technologies Used

- **Backend**: Express.js, Node.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: MongoDB (optional)
- **Authentication**: JWT, Telegram OAuth
- **Bot API**: node-telegram-bot-api

## Features Breakdown

### Music Player
- Play/pause functionality
- Next/previous track navigation
- Progress bar with seek
- Volume control
- Track duration display
- Album artwork

### Search & Browse
- Search by song title or artist
- Filter by genre
- Browse all tracks
- View top tracks

### Playlists
- Create custom playlists
- Add/remove tracks
- View playlist details
- Share playlists (with users)

### User System
- User registration and login
- Favorite tracks management
- Listening history
- User profiles
- Statistics tracking

## Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set WEB_APP_URL=your_heroku_url
git push heroku main
```

### Docker
```bash
docker build -t telegram-music-app .
docker run -p 3000:3000 -e TELEGRAM_BOT_TOKEN=your_token telegram-music-app
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/nomadbeats/Miniapp/issues)
- Email: support@example.com

## Roadmap

- [ ] Real music streaming API integration
- [ ] User authentication with database
- [ ] Offline mode support
- [ ] Dark/Light theme toggle
- [ ] Music recommendations
- [ ] Social features (follow, share)
- [ ] Advanced search filters
- [ ] Queue management
- [ ] Lyrics display
- [ ] Audio visualization

---

**Made with ❤️ by nomadbeats**
