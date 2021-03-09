# Kangaroo Server
Kangaroo backend using the [Nest](https://github.com/nestjs/nest) framework and Postgres.

- **Docker containers** available in the private registry for easy deployment.
- **Swagger API documentation** is available at `/api` when application is run in development mode.

## Development

```bash
$ npm run docker:dev
```

- To manually stop the Postgres docker (might be running in background)
```bash
$ npm run docker:postgres:stop
```

## Development (no-docker)
- Have a Postgres server running with the credentials set in `.env`.

```bash
$ npm run start:dev
```

## OpenAPI Client Generation
* Output folder of client is `/app/src/api/generated-typescript-api-client`
```bash
$ npm run task:client-gen
```

## Useful Scripts
```bash
# Access Postgres database
$ docker exec -it postgres bash
$ psql -U {{ POSTGRES_USER }} -W -d {{ POSTGRES_DB }}
```

```bash
# Clear all database files (virtual volume)
$ npm run docker:postgres:stop
$ docker volume rm kangaroo-server_kangaroo-db
or
$ npm run docker:postgres:clear
```



