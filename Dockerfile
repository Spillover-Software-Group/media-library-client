FROM node:16-alpine
WORKDIR /client
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 1234
