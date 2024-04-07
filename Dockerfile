FROM node:18-slim
WORKDIR /confab
COPY . .
RUN yarn
CMD ["node", "main.js"]
