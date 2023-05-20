FROM node:18

COPY ["package-lock.json", "package.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY [".", "/usr/src/"]

EXPOSE 3000

CMD ["npm","run","start:dev"]