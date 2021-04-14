FROM node:lts-slim as builder

RUN mkdir /work/
WORKDIR /work/

COPY . .

RUN npm install && \
    npx browserslist@latest --update-db && \
    npm run build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/

COPY --from=builder /work/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
