# ---- Base Node ----
FROM node:13 AS base
USER node
WORKDIR /home/node
COPY package.json .

# ---- Dependencies ----
FROM base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production --arch=x64 --platform=linux
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# then install the 'devDependencies'
RUN npm install --arch=x64 --platform=linux

# ---- Test ----
FROM dependencies AS test
COPY . .
RUN npm run test

# ---- Release ----
FROM node:13-slim AS release
USER node
WORKDIR /home/node
COPY --from=dependencies /home/node/prod_node_modules ./node_modules
COPY . .

EXPOSE 8080
CMD npm start
