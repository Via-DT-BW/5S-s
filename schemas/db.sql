USE teste_hugo

CREATE TABLE audit_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    audit_type INT NOT NULL,
    FOREIGN KEY (audit_type) REFERENCES audit_types(id)
);

CREATE TABLE checklists (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category INT NOT NULL,
    factor NVARCHAR(255) NOT NULL,
    criteria NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(id)
);

CREATE TABLE departments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    audit_type INT NOT NULL,
    FOREIGN KEY (audit_type) REFERENCES audit_types(id)
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

CREATE TABLE audits (
    id INT IDENTITY(1,1) PRIMARY KEY,
    signed INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    next_date DATETIME,
    overall_score INT NOT NULL,
    completed BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (signed) REFERENCES users(id)
);

CREATE TABLE audit_checklist (
    audit INT NOT NULL,
    checklist INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 4),
    noks INT NOT NULL,
    PRIMARY KEY (audit, checklist),
    FOREIGN KEY (audit) REFERENCES audits(id),
    FOREIGN KEY (checklist) REFERENCES checklists(id)
);

-- TODO: Reformulate how the noks are done in the near future
-- CREATE TABLE noks (
--     id INT IDENTITY(1,1) PRIMARY KEY,
--     checklist INT NOT NULL,
--     description NVARCHAR(MAX) NOT NULL,
--     FOREIGN KEY (checklist) REFERENCES checklists(id)
-- );
