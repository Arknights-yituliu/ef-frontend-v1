# 注意，构建docker镜像时，需要确保Docker服务已启动，且控制台目录为项目根目录
# 构建命令：docker build -t ef-frontend-v1 .
# 运行命令：docker run -d -p 80:80 ef-frontend-v1
# 访问地址：http://localhost:80
# 若镜像构建时拉取node和nginx镜像失败，可以考虑手动拉取node:20-alpine和nginx:1.28-alpine-slim镜像
# 手动拉取命令：docker pull node:20-alpine && docker pull nginx:1.28-alpine-slim
# 多阶段构建：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和yarn.lock用于依赖安装
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用（SSG）
RUN yarn generate

# 验证构建产物是否存在
RUN ls -la /app/.output/public/ && test -f /app/.output/public/index.html || (echo "ERROR: index.html not found in build output" && exit 1)

# 生产阶段：使用nginx提供静态文件服务
FROM nginx:1.28-alpine-slim AS production

# 先删除nginx默认文件，避免构建产物覆盖失败
RUN rm -rf /usr/share/nginx/html/*

# 复制构建产物到nginx静态文件目录
COPY --from=builder /app/.output/public /usr/share/nginx/html

# 验证复制后的文件
RUN ls -la /usr/share/nginx/html/ && test -f /usr/share/nginx/html/index.html || (echo "ERROR: index.html not found after copy" && exit 1)

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]

