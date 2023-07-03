FROM node:18-alpine
WORKDIR /confab
COPY . .
RUN yarn
CMD ["node", "main.js"]
EXPOSE 1337
EXPOSE 1338
