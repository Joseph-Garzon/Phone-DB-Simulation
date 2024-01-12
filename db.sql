    DROP TABLE IF EXISTS account CASCADE;
    DROP TABLE IF EXISTS customer CASCADE;
    DROP TABLE IF EXISTS bank_account CASCADE;
    DROP TABLE IF EXISTS plan CASCADE;
    DROP TABLE IF EXISTS payment_history CASCADE;
    DROP TABLE IF EXISTS call CASCADE;
    
    CREATE TABLE customer (
        customer_ssn INT,
        customer_id INT,
        street_address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip INT,
        PRIMARY KEY (customer_ssn, customer_id),
        UNIQUE(customer_id)
    );
    INSERT INTO customer (customer_ssn, customer_id, street_address, city, state, zip) VALUES 
    (45321978, 1, '123 Main St', 'Los Angeles', 'CA', 90001),
    (82756413, 2, '456 Elm St', 'New York', 'NY', 10001),
    (63987042, 3, '789 Oak St', 'Chicago', 'IL', 60601),
    (12456789, 4, '101 Pine St', 'San Francisco', 'CA', 94101),
    (98743210, 5, '202 Maple St', 'Houston', 'TX', 77001),
    (76543210, 6, '303 Cedar St', 'Miami', 'FL', 33101),
    (31415926, 7, '404 Birch St', 'Seattle', 'WA', 98101),
    (52535455, 8, '505 Willow St', 'Boston', 'MA', 02101),
    (12345678, 9, '606 Spruce St', 'Atlanta', 'GA', 30301),
    (87654321, 10, '707 Redwood St', 'Dallas', 'TX', 75201),
    (23984765, 11, '999 Yeye Dr', 'Austin', 'TX', 80069);
    
    CREATE TABLE account (
        customer_id INT PRIMARY KEY REFERENCES customer(customer_id),
        account_name VARCHAR(255),
        plan_name VARCHAR(255),
        payment_type VARCHAR(255),
        minutes_remaining FLOAT,
        data_remaining FLOAT,
        amount_due INT
    );
    INSERT INTO account (customer_id, account_name, plan_name, payment_type, minutes_remaining, data_remaining, amount_due) VALUES 
    (1, 'John', 'Prepaid Basic', 'manual', 284, 4.2, 10),
    (2, 'Jane', 'Prepaid Upgraded', 'auto', 1103, 10.15, 30),
    (3, 'Alice', 'Postpaid Basic', 'manual', 468, 8.4, 30),
    (4, 'Bob', 'Postpaid Basic', 'manual', 548, 12.4, 30),
    (5, 'Charlie', 'Postpaid Upgraded', 'auto', 1040, 12, 50),
    (6, 'Cora', 'Postpaid Upgraded', 'auto', 1085, 14.25, 50),
    (7, 'Saira', 'Unlimited', 'auto', 0, 0, 100),
    (8, 'Cole', 'Unlimited', 'auto', 0, 0, 100),
    (9, 'Julia', 'Unlimited', 'auto', 0, 0, 100),
    (10, 'DMX', 'Unlimited', 'auto', 0, 0, 100);
    
    CREATE TABLE bank_account (
        acc_num INT PRIMARY KEY,
        customer_id INT,
        rout_num INT,
        balance FLOAT,
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    );
    INSERT INTO bank_account (acc_num, customer_id, rout_num, balance) VALUES 
    (123456789, 7, 198345212, 1000),
    (234567890, 4, 109657234, 1250),
    (345678901, 10, 198345212, 500),
    (456789012, 5, 109657234, 9000) ,
    (567890123, 1, 483495584, 5001),
    (678901234, 8, 198345212, 900),
    (789012345, 3, 198345212, 200),
    (890123456, 6, 737374452, 123.45),
    (901234567, 9, 353778545, 954.63),
    (987654321, 2, 198345212, 99.99);
    
    
    CREATE TABLE plan (
        plan_name VARCHAR(255) PRIMARY KEY,
        minute_limit FLOAT,
        data_limit FLOAT,
        overdraft_fee FLOAT,
        initial_price FLOAT
    );
    INSERT INTO plan (plan_name, minute_limit, data_limit, overdraft_fee, initial_price) VALUES 
    ('Prepaid Basic', 400, 10, 0, 10),
    ('Prepaid Upgraded', 1200, 15, 0, 30),
    ('Postpaid Basic', 600, 15, 100, 30), 
    ('Postpaid Upgraded', 1200, 20, 100, 50), 
    ('Unlimited', 0, 0, 0, 100); 
    
    
    CREATE TABLE payment_history(
      payment_id INT PRIMARY KEY,
      customer_id INT,
      account_name VARCHAR(255),
      amount FLOAT
    );
    
    
    CREATE TABLE call (
        call_id INT PRIMARY KEY,
        customer_id INT,
        call_duration FLOAT,
        data_usage FLOAT,
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    );
    INSERT INTO call (call_id, customer_id, call_duration, data_usage) VALUES 
    (1, 4, 12, 0.60),
    (2, 6, 28, 1.40),
    (3, 10, 8, 0.40),
    (4, 5, 45, 2.25),
    (5, 9, 17, 0.85),
    (6, 2, 23, 1.15),
    (7, 8, 5, 0.25),
    (8, 3, 34, 1.70),
    (9, 7, 11, 0.55),
    (10, 1, 39, 1.95),
    (11, 5, 15, 0.75),
    (12, 4, 22, 1.10),
    (13, 9, 9, 0.45),
    (14, 10, 41, 2.05),
    (15, 1, 16, 0.80),
    (16, 2, 20, 1.00),
    (17, 8, 7, 0.35),
    (18, 6, 30, 1.50),
    (19, 7, 14, 0.70),
    (20, 3, 33, 1.65),
    (21, 2, 10, 0.50),
    (22, 10, 26, 1.30),
    (23, 4, 7, 0.35),
    (24, 9, 42, 2.10),
    (25, 1, 18, 0.90),
    (26, 11, 25, 1.25),
    (27, 3, 6, 0.30),
    (28, 7, 38, 1.90),
    (29, 6, 13, 0.65),
    (30, 5, 37, 1.85),
    (31, 4, 11, 0.55),
    (32, 10, 29, 1.45),
    (33, 9, 10, 0.50),
    (34, 2, 44, 2.20),
    (35, 11, 19, 0.95),
    (36, 8, 21, 1.05),
    (37, 6, 8, 0.40),
    (38, 3, 35, 1.75),
    (39, 7, 12, 0.60),
    (40, 5, 31, 1.55),
    (41, 10, 16, 0.80),
    (42, 9, 27, 1.35),
    (43, 10, 11, 0.55),
    (44, 1, 43, 2.15),
    (45, 11, 20, 1.00),
    (46, 3, 24, 1.20),
    (47, 7, 9, 0.45),
    (48, 5, 32, 1.60),
    (49, 8, 15, 0.75),
    (50, 6, 36, 1.80);    