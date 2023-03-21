FROM debian:10
RUN apt-get update && apt-get install npm@9 -y
COPY . /home/app
WORKDIR /home/app
RUN npm install -g @nestjs/cli --allow-root
CMD ["npm", "run", "start:dev"]