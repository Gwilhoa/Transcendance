FROM node:latest
RUN apt-get update && apt-get upgrade -y
RUN npm install -g npm@9.2
COPY . /home/app
WORKDIR /home/app
RUN npm install @nestjs/cli
CMD ["npm", "run", "start:dev"]