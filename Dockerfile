FROM node:lts-alpine AS build
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm --registry https://registry.npm.taobao.org install --production --silent && mv node_modules ../
RUN npm install --production --silent && mv node_modules ../
COPY . .
# EXPOSE 3000
# RUN chown -R node /usr/src/app
# USER node
RUN npm run build

FROM nginx:alpine

# # Remove default nginx server definition
RUN rm /etc/nginx/conf.d/default.conf

# # Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# # Copy the build files from the previous step
COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80 for the Nginx server
EXPOSE 80

# # Start Nginx
CMD ["nginx", "-g", "daemon off;"]

