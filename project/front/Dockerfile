FROM node:latest

WORKDIR /usr/src/app

COPY ./ts .

RUN npm install -g npm@9.6.2

CMD ["npm", "run", "start"]