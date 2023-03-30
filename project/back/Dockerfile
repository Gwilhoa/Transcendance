FROM node:latest
EXPOSE 6200
RUN apt-get update && apt-get upgrade -y &&  \
    apt-get -y install npm install -g npm@9.2 ;\
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY ./app /home/app

WORKDIR /home/app

RUN npm install

CMD ["npm", "run", "dev"]