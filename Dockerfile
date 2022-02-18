FROM node:14-alpine

RUN apk add --update imagemagick && \
    apk add --update graphicsmagick && \
    apk add --update bash

COPY . .

EXPOSE 8000

RUN npm install --silent

RUN cp .env.example .env

RUN PROJECT_FOLDER=Mapped3D_backend bash setup_upload.sh

CMD ["npm","start"]