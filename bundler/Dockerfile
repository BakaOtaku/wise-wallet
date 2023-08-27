FROM node:18-alpine

# arguments
ARG PORT=3000

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock ./

# install packages
RUN yarn install
COPY . /app 

RUN yarn run build
EXPOSE 3000

CMD ["yarn", "run", "start:prod"]