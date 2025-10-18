# AutoFix Application Architecture

## URL Structure

### Frontend
- External: https://autofix.prochainconsulting.com
- Nginx Port: 443 (HTTPS)
- Container Port: 3004
- Internal Port: 3000

### Backend API v1
- External: https://backend.prochainconsulting.com/api/v1
- Nginx Port: 443 (HTTPS)
- Container Port: 4000
- Internal Port: 4000

## Container Overview

| Container | Ports | Status |
|-----------|-------|--------|
| autofix_frontend_prod | 3004:3000 | New |
| Backend API | 4000:4000 | Running |
| ride_postgres_dev | 5432:5432 | Running |
| ride_redis_dev | 6379:6379 | Running |

## API Integration

Frontend calls backend at:
```
https://backend.prochainconsulting.com/api/v1
```

Example:
```javascript
// Login endpoint
POST https://backend.prochainconsulting.com/api/v1/auth/login

// Garages endpoint
GET https://backend.prochainconsulting.com/api/v1/garages
```

## Deployment Path

```
/var/www/autofix-frontend
```

## Key Files

- .env.production - API v1 URL configured
- .github/workflows/deploy.yml - CI/CD pipeline
- docker-compose.prod.yml - Container config
- nginx.conf - Reverse proxy config
