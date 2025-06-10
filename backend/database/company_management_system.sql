-- Bảng Users để lưu thông tin chung của tất cả người dùng
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    PhoneNumber VARCHAR(20) UNIQUE,
    Role ENUM('Admin', 'Customer') NOT NULL
);

INSERT INTO Users (Username, Password, Email, PhoneNumber, Role) VALUES ('admin', 'admin', 'admin@gmail.com', '0909090909', 'Admin');

-- Bảng Products để lưu thông tin sản phẩm
CREATE TABLE Products (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL
);

-- Bảng Cart để lưu thông tin giỏ hàng
CREATE TABLE Cart (
    CartID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

-- Bảng Orders để lưu thông tin đơn hàng
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    OrderDate DATE NOT NULL DEFAULT CURRENT_DATE,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Bảng OrderDetails để lưu chi tiết từng sản phẩm trong đơn hàng
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);
