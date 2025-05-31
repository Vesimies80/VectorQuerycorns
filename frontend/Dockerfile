FROM node:18-alpine AS base

WORKDIR /work

COPY components.json jsconfig.json package-lock.json postcss.config.mjs tailwind.config.js eslint.config.mjs next.config.mjs package.json /work/
RUN npm i
ADD src public /work/

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

