# ---- Build Stage ----

FROM node:18 AS builder

WORKDIR /app
 
# copy deps first (cache)

COPY package*.json ./

RUN npm install
 
# copy everything else

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
 
# build for production

RUN npm run build
 
# ---- Production Stage ----

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
 
# remove default nginx static assets

RUN rm -rf ./*
 
# copy build output from builder

COPY --from=builder /app/dist ./

# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# expose port

EXPOSE 80
 
# start nginx

CMD ["nginx", "-g", "daemon off;"]
 

