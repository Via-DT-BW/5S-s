USE teste_hugo;

CREATE TABLE departments (
    id INT IDENTITY(1,1) PRIMARY KEY, 
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE spaces (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    departmentId INT NOT NULL,
    FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE sheets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    spaceId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    signedBy NVARCHAR(255),
    nextDate DATETIME,
    FOREIGN KEY (spaceId) REFERENCES spaces(id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    sheetId INT NOT NULL,
    FOREIGN KEY (sheetId) REFERENCES sheets(id) ON DELETE CASCADE
);

CREATE TABLE checklist_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    categoryId INT NOT NULL,
    factor NVARCHAR(255) NOT NULL,
    criteria NVARCHAR(MAX) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 4),
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE noks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    checklistItemId INT NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (checklistItemId) REFERENCES checklist_items(id) ON DELETE CASCADE
);
