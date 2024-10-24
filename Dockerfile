# 使用官方 Node.js 镜像
# https://hub.docker.com/_/node
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "npm", "start" ]

# 说明服务监听端口 8080
EXPOSE 8080

# 构建容器镜像
# 使用 Cloud Build 服务构建容器镜像并将其存储在 Container Registry 中
RUN gcloud builds submit --tag gcr.io/[PROJECT-ID]/[IMAGE-NAME]

# 部署到 Cloud Run
# 部署容器镜像到 Cloud Run
RUN gcloud run deploy --image gcr.io/[PROJECT-ID]/[IMAGE-NAME] --platform managed
```sh
gcloud run deploy --image gcr.io/[PROJECT-ID]/[IMAGE-NAME] --platform managed
```

5. **Follow the prompts**:
- During deployment, you will be prompted to specify the service name, region, and other settings. 
# 使用官方 Node.js 14 镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 5004

# 启动应用
CMD [ "npm", "start" ]