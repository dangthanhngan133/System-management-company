-- Tạo bảng auth_user (Django's built-in User model)
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

-- Tạo bảng users_userprofile
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

-- Tạo bảng products_product
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

-- Tạo các bảng cần thiết cho Django
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

CREATE TABLE IF NOT EXISTS django_admin_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_time DATETIME NOT NULL,
    object_id TEXT,
    object_repr VARCHAR(200),
    action_flag SMALLINT NOT NULL,
    change_message TEXT NOT NULL,
    content_type_id INT,
    user_id INT NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) NOT NULL PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME NOT NULL
);

-- Tạo các bảng cho authentication
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