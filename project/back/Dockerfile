FROM node:latest
EXPOSE 6200
RUN apt-get update && apt-get upgrade -y && \
    npm install -g npm@9.2 && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY ./app /home/app

WORKDIR /home/app

RUN npm install @nestjs/cli @nestjs/typeorm typeorm dotenv pg

CMD ["npm", "run", "start:dev"]