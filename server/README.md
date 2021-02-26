# Giraffe Server
Kangaroo backend using the [Nest](https://github.com/nestjs/nest) framework and Postgres.

- **Docker containers** available in the private registry for easy deployment.
- **Swagger API documentation** is available at `/api` when application is run in development mode.

## Development

- Local images (no registry login needed)
- Hot reloading from file system
```bash
$ npm run docker:dev
```

**Note:** currently hot reload doesn't work on file additions, so stop and start if you have any.
```bash
$ npm run docker:dev:stop
```

## Development (no-docker)
- Have a Postgres server running with the credentials set in `.env`.

```bash
$ npm install
$ npm run start:dev (development)
or
$ npm run start (production)
```

## Useful Scripts
```bash
# Access Postgres database
$ docker exec -it postgres bash
$ psql -U {{ POSTGRES_USER }} -W -d {{ POSTGRES_DB }}
```

```bash
# Clear all database files (virtual volume)
$ docker volume rm server_giraffe-db
```



