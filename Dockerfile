FROM node:alpine

LABEL "com.github.actions.name"="autolabel"
LABEL "com.github.actions.description"="Add labels to Pull Request based on matched file patterns"
LABEL "com.github.actions.icon"="flag"
LABEL "com.github.actions.color"="gray-dark"

COPY . .
RUN yarn install
RUN apk --no-cache add git
ENTRYPOINT ["node", "/dist/entrypoint.js"]
