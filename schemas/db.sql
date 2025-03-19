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
    audit_interval_value INT DEFAULT 1 CHECK (audit_interval_value > 0),
    audit_interval_unit VARCHAR(10) DEFAULT 'MONTH' CHECK (audit_interval_unit IN ('WEEK', 'MONTH')), 
    next_required_audit_date DATE,
    audit_status BIT DEFAULT 0,
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
    department INT NULL,
    FOREIGN KEY (department) REFERENCES departments(id)
);

CREATE TABLE department_responsibles (
    department INT NOT NULL,
    responsible INT NOT NULL,
    role NVARCHAR(100) NOT NULL, -- MKT, PL, PLM, etc.
    PRIMARY KEY (department, responsible),
    FOREIGN KEY (department) REFERENCES departments(id),
    FOREIGN KEY (responsible) REFERENCES users(id)
)

CREATE TABLE audits (
    id INT IDENTITY(1,1) PRIMARY KEY,
    signed INT NULL,
    space INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    overall_score INT NULL,
    comments NVARCHAR(MAX) NULL,
    FOREIGN KEY (signed) REFERENCES users(id),
    FOREIGN KEY (space) REFERENCES spaces(id)
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

-- Trigger to update department audit status
CREATE TRIGGER trg_update_audit_status
ON audits
AFTER INSERT
AS
BEGIN
    UPDATE d
    SET 
        d.audit_status = 1,
        d.next_required_audit_date = CASE 
            WHEN d.audit_interval_unit = 'WEEK' THEN DATEADD(WEEK, d.audit_interval_value, GETDATE())
            WHEN d.audit_interval_unit = 'MONTH' THEN DATEADD(MONTH, d.audit_interval_value, GETDATE())
        END
    FROM departments d
    JOIN inserted i ON d.id = (SELECT department FROM spaces WHERE id = i.space)
    WHERE d.audit_status = 0;
END;

-- Stored procedure to reset audit status for missed audits
CREATE PROCEDURE sp_check_missed_audits
AS
BEGIN
    UPDATE departments
    SET audit_status = 0
    WHERE next_required_audit_date < GETDATE() AND audit_status = 1;
END;
