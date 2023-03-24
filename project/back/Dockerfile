FROM node:latest
EXPOSE 6200
RUN apt-get update && apt-get upgrade -y && \
    npm install -g npm@9.6.2

COPY ./app /home/app

WORKDIR /home/app

RUN npm install @nestjs/cli @nestjs/typeorm typeorm dotenv pg axios

CMD ["npm", "run", "start:dev"]