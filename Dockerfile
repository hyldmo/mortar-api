FROM node:10.0.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

ENV PORT=80

CMD [ "npm", "start" ]

EXPOSE 80