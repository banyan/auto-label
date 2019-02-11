FROM node:alpine

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="autolabel"
LABEL "com.github.actions.description"="Add labels to Pull Request based on matched file patterns"
LABEL "com.github.actions.icon"="flag"
LABEL "com.github.actions.color"="gray-dark"

# Copy the rest of your action's code
COPY . .

# Install dependencies
RUN yarn install

RUN apk --no-cache add git

# Run `node /entrypoint.js`
ENTRYPOINT ["node", "/dist/entrypoint.js"]
