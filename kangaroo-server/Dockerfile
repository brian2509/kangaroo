FROM node:15-alpine
ENV NODE_ENV=development

ENV BUILD_DEPS autoconf autoremake

# needed to make gifsicle work in alpine
RUN apk update && apk add --update --no-cache --virtual .build-deps autoconf file gcc libc-dev make g++ pkgconf re2c git automake

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "start:prod"]
