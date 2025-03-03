USE teste_hugo

CREATE TABLE departments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE spaces (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    department INT NOT NULL,
    FOREIGN KEY (department) REFERENCES departments(id)
);

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME2(3) NOT NULL DEFAULT SYSDATETIME(),
    is_admin BIT NOT NULL DEFAULT 0,
    enabled BIT NOT NULL DEFAULT 1,
    department INT NOT NULL DEFAULT -1, -- invalid department, choose department on first login
    FOREIGN KEY (department) REFERENCES departments(id)
);

CREATE TABLE sheets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    space INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    signedBy NVARCHAR(255),
    nextDate DATETIME,
    FOREIGN KEY (space) REFERENCES spaces(id)
);

CREATE TABLE sheet_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    sheetId INT NOT NULL,
    FOREIGN KEY (sheetId) REFERENCES sheets(id)
);

CREATE TABLE checklists (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category INT NOT NULL,
    factor NVARCHAR(255) NOT NULL,
    criteria NVARCHAR(MAX) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 4),
    FOREIGN KEY (category) REFERENCES categories(id)
);

CREATE TABLE noks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    checklist INT NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (checklist) REFERENCES checklists(id)
);
