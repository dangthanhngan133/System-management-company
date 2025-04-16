-- Bảng Users để lưu thông tin chung của tất cả người dùng
CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    Email TEXT UNIQUE,
    PhoneNumber TEXT UNIQUE,
    Role TEXT NOT NULL CHECK (Role IN ('Admin', 'Customer')) -- Phân biệt Admin và Customer
);

-- Bảng Products để lưu thông tin sản phẩm
CREATE TABLE Products (
    ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductName TEXT NOT NULL,
    Description TEXT,
    Price REAL NOT NULL,
    Stock INTEGER NOT NULL -- Số lượng sản phẩm trong kho
);

-- Bảng Cart để lưu thông tin giỏ hàng của khách hàng
CREATE TABLE Cart (
    CartID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Bảng Orders để lưu thông tin đơn hàng
CREATE TABLE Orders (
    OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    OrderDate DATE NOT NULL DEFAULT (DATE('now')),
    TotalAmount REAL NOT NULL,
    Status TEXT NOT NULL CHECK (Status IN ('Pending', 'Completed', 'Cancelled')),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng OrderDetails để lưu chi tiết từng sản phẩm trong đơn hàng
CREATE TABLE OrderDetails (
    OrderDetailID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    Price REAL NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);