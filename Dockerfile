FROM node:alpine
COPY . .
RUN yarn install
RUN apk --no-cache add git
ENTRYPOINT ["node", "/dist/entrypoint.js"]
