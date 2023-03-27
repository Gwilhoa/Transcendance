FROM node:latest
EXPOSE 6200

COPY ./app /home/app

WORKDIR /home/app

RUN npm install 

CMD ["npm", "run", "start:dev"]