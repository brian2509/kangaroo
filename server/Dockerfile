FROM node:15-alpine
ENV NODE_ENV=development

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]