FROM node:latest

RUN apt-get update && apt-get upgrade -y && \
    npm install -g npm@9.2

COPY ./app /home/app

WORKDIR /home/app

RUN npm install @nestjs/cli @nestjs/typeorm typeorm dotenv pg

CMD ["npm", "run", "start:dev"]