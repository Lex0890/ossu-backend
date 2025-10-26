# OSSU Backend API

> REST API for an osu! community social network built with Express.js, TypeScript, Prisma, and PostgreSQL.

[🇪🇸 Versión en Español](./README.es.md)

## 🚀 Current Status

### Implemented Features

#### OAuth2 Authentication
- ✅ osu! OAuth login
- ✅ Token management (access & refresh)
- ✅ JWT authentication middleware
- ✅ Secure session cookies
- ✅ Logout

#### User System
- ✅ Auto-sync with osu! API
- ✅ Stats storage: PP, rank, accuracy, level
- ✅ Follow/followers system
- ✅ Personalized interests (tags)

#### Social Feed
- ✅ Posts with title, content, and images
- ✅ Tag system for categorizing posts
- ✅ Personalized feed based on:
  - Users you follow
  - Your interests (tags)
  - Popularity (likes)
  - Recency (recent posts)
- ✅ Cursor-based pagination
- ✅ Complete CRUD for posts

#### Social Interactions
- ✅ Likes on posts and comments
- ✅ Comment system
- ✅ CRUD for comments

## 🛠 Tech Stack

- **Runtime**: Node.js with Bun
- **Framework**: Express.js 5
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + osu! OAuth2
- **Logging**: Pino + Morgan
- **Deploy**: Vercel

## 📦 Installation
## 📦 Installation

```bash path=null start=null
# Clone repository
git clone <repo-url>
cd api

# Install dependencies
bun install

# Configure environment variables
cp .env.example .env

# Run migrations
bun prisma migrate dev

# Start development server
bun run dev
```

## 🔧 Environment Variables

```bash path=null start=null
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
OSU_CLIENT_ID=your_client_id
OSU_CLIENT_SECRET=your_client_secret
OSU_REDIRECT_URI=http://localhost:3000/auth/callback
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
BASEURL=http://localhost:3000
PORT=3000
```

## 📚 Available Endpoints

### Authentication
- `GET /auth` - Start OAuth with osu!
- `GET /auth/callback` - OAuth callback
- `POST /auth/logout` - Logout
- `GET /me` - Get authenticated user

### Feed
- `GET /feed` - Get personalized feed
- `POST /feed` - Create new post
- `GET /feed/:id` - Get specific post
- `PUT /feed/:id` - Update post
- `DELETE /feed/:id` - Delete post
- `POST /feed/:id/like` - Like/unlike post
- `POST /feed/:id/comment` - Comment on post
- `POST /feed/:id/comment/:commentId/like` - Like/unlike comment
- `PUT /feed/:id/comment/:commentId` - Update comment
- `DELETE /feed/:id/comment/:commentId` - Delete comment

## 🔮 Roadmap - Upcoming Features

### 🎯 Short Term
- [ ] Real-time notification system (WebSockets)
- [ ] Advanced user and post search
- [ ] Complete user profiles
- [ ] Privacy settings
- [ ] Rate limiting and throttling
- [ ] Data validation with Zod
- [ ] Unit and integration tests

### 🚀 Medium Term
- [ ] Private chat between users
- [ ] Reputation/karma system
- [ ] User mentions (@user)
- [ ] Hashtags (#topic)
- [ ] Trending/popular feed
- [ ] Saved/favorites
- [ ] Share posts
- [ ] Content filters
- [ ] Moderation and reports

### 🌟 Long Term
- [ ] Integration with osu! replays
- [ ] Epic play highlights
- [ ] Tournament system
- [ ] Custom achievements and badges
- [ ] Public API with rate limits
- [ ] Event webhooks
- [ ] Analytics and statistics
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 📊 Data Model

### Main Entities
- **OsuUser**: Users with osu! stats
- **FeedItem**: Feed posts
- **Comment**: Post comments
- **Like**: Likes on posts and comments
- **Follow**: Following relationships
- **Tag**: Tags/interests

## 🤝 Contributing

To contribute to the project:
1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details
