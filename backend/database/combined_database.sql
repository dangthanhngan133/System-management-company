-- Tạo database
CREATE DATABASE IF NOT EXISTS company_management_system;
USE company_management_system;

-- Các bảng cơ bản của Django
CREATE TABLE IF NOT EXISTS django_migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE(app_label, model)
);

CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) NOT NULL PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME NOT NULL
);

-- Bảng Users (Django auth)
CREATE TABLE IF NOT EXISTS auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME NOT NULL
);

-- Bảng UserProfile (Kết hợp thông tin từ cả hai hệ thống)
CREATE TABLE IF NOT EXISTS users_userprofile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'Customer',
    phone VARCHAR(20) UNIQUE,
    address TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- Bảng Products (Kết hợp thông tin từ cả hai hệ thống)
CREATE TABLE IF NOT EXISTS products_product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    features JSON,
    specifications JSON,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Bảng Cart
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products_product(id) ON DELETE CASCADE
);

-- Bảng Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- Bảng OrderDetails
CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products_product(id) ON DELETE CASCADE
);

-- Các bảng authentication của Django
CREATE TABLE IF NOT EXISTS auth_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id),
    UNIQUE(content_type_id, codename)
);

CREATE TABLE IF NOT EXISTS auth_user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (group_id) REFERENCES auth_group(id),
    UNIQUE(user_id, group_id)
);

CREATE TABLE IF NOT EXISTS auth_user_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id),
    UNIQUE(user_id, permission_id)
);

-- Tạo admin user mặc định
INSERT INTO auth_user (username, password, email, is_superuser, is_staff, is_active, date_joined, first_name, last_name)
VALUES ('admin', 'pbkdf2_sha256$600000$your_hashed_password_here', 'admin@example.com', TRUE, TRUE, TRUE, NOW(), 'Admin', 'User');

-- Tạo user profile cho admin
INSERT INTO users_userprofile (user_id, role, phone, created_at, updated_at)
VALUES (1, 'Admin', '0909090909', NOW(), NOW());