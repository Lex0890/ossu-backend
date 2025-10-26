# OSSU Backend API

API REST para red social de la comunidad osu! construida con Express.js, TypeScript, Prisma y PostgreSQL.

## 🚀 Estado Actual

### Funcionalidades Implementadas

#### Autenticación OAuth2
- ✅ Login con osu! OAuth
- ✅ Gestión de tokens (access & refresh)
- ✅ Middleware de autenticación JWT
- ✅ Cookies seguras para sesiones
- ✅ Logout

#### Sistema de Usuarios
- ✅ Sincronización automática con API de osu!
- ✅ Almacenamiento de estadísticas: PP, rank, accuracy, nivel
- ✅ Sistema de follow/followers
- ✅ Intereses personalizados (tags)

#### Feed Social
- ✅ Publicaciones con título, contenido e imágenes
- ✅ Sistema de tags para categorizar posts
- ✅ Feed personalizado basado en:
  - Usuarios que sigues
  - Tus intereses (tags)
  - Popularidad (likes)
  - Recencia (posts recientes)
- ✅ Paginación cursor-based
- ✅ CRUD completo de posts

#### Interacciones Sociales
- ✅ Likes en posts y comentarios
- ✅ Sistema de comentarios
- ✅ CRUD de comentarios

## 🛠 Stack Tecnológico

- **Runtime**: Node.js con Bun
- **Framework**: Express.js 5
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT + osu! OAuth2
- **Logging**: Pino + Morgan
- **Deploy**: Vercel

## 📦 Instalación

```bash path=null start=null
# Clonar repositorio
git clone <repo-url>
cd api

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
bun prisma migrate dev

# Iniciar servidor de desarrollo
bun run dev
```

## 🔧 Variables de Entorno

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

## 📚 Endpoints Disponibles

### Autenticación
- `GET /auth` - Inicia OAuth con osu!
- `GET /auth/callback` - Callback de OAuth
- `POST /auth/logout` - Cierra sesión
- `GET /me` - Obtiene usuario autenticado

### Feed
- `GET /feed` - Obtiene feed personalizado
- `POST /feed` - Crea nuevo post
- `GET /feed/:id` - Obtiene post específico
- `PUT /feed/:id` - Actualiza post
- `DELETE /feed/:id` - Elimina post
- `POST /feed/:id/like` - Like/unlike post
- `POST /feed/:id/comment` - Comenta en post
- `POST /feed/:id/comment/:commentId/like` - Like/unlike comentario
- `PUT /feed/:id/comment/:commentId` - Actualiza comentario
- `DELETE /feed/:id/comment/:commentId` - Elimina comentario

## 🔮 Roadmap - Próximas Funcionalidades

### 🎯 Corto Plazo
- [ ] Sistema de notificaciones en tiempo real (WebSockets)
- [ ] Búsqueda avanzada de usuarios y posts
- [ ] Perfiles de usuario completos
- [ ] Configuración de privacidad
- [ ] Rate limiting y throttling
- [ ] Validación de datos con Zod
- [ ] Tests unitarios e integración

### 🚀 Mediano Plazo
- [ ] Chat privado entre usuarios
- [ ] Sistema de reputación/karma
- [ ] Menciones (@usuario)
- [ ] Hashtags (#tema)
- [ ] Feed de trending/popular
- [ ] Guardados/favoritos
- [ ] Compartir posts
- [ ] Filtros de contenido
- [ ] Moderación y reportes

### 🌟 Largo Plazo
- [ ] Integración con replays de osu!
- [ ] Destacados de jugadas épicas
- [ ] Sistema de torneos
- [ ] Logros y badges personalizados
- [ ] API pública con rate limits
- [ ] Webhooks para eventos
- [ ] Analytics y estadísticas
- [ ] Soporte multilenguaje
- [ ] App móvil (React Native)

## 📊 Modelo de Datos

### Entidades Principales
- **OsuUser**: Usuarios con stats de osu!
- **FeedItem**: Publicaciones del feed
- **Comment**: Comentarios en posts
- **Like**: Likes en posts y comentarios
- **Follow**: Relaciones de seguimiento
- **Tag**: Tags/intereses

## 🤝 Contribuir

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles
