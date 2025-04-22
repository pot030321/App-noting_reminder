# Chọn nginx làm base image
FROM nginx:alpine

# Xóa file mặc định
RUN rm -rf /usr/share/nginx/html/*

# Sao chép file build vào nginx
COPY dist /usr/share/nginx/html

# Thêm cấu hình nginx mới
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose đúng cổng 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
