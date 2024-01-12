//Download nodejs(https://nodejs.org/en/download)
//Run following command to install libraries: npm install express pg
//Alter ./creds.json with your local psql credentials
//Start server using command: node hw2.js
//Open browser and go to http://localhost:3000/;

const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 3001;

const creds = require("./creds.json");
const pool = new Pool(creds);

async function initialize() {
  try {
    await pool.query(`
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
    (8, 'Cole', 'Unlimited', 'manual', 0, 0, 100),
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
    `);
  } catch (err) {
    console.error("Error executing initialization query:", err);
  }
}

async function drop() {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS account CASCADE;
      DROP TABLE IF EXISTS customer CASCADE;
      DROP TABLE IF EXISTS bank_account CASCADE;
      DROP TABLE IF EXISTS plan CASCADE;
      DROP TABLE IF EXISTS payment_history CASCADE;
      DROP TABLE IF EXISTS call CASCADE;
    `);
  } catch (err) {
    console.error("Error executing drop query:", err);
  }
}

app.get("/", async (req, res) => {
  const customerId = req.query.customerId;
  let transactionsHtml = "";
  let customerName = "";

  if (customerId) {
    try {
      const result = await pool.query(
        `
                SELECT a.*, c.customer_ssn AS ssn, c.street_address AS street, c.city AS city, c.state AS state, c.zip AS zip_code, b.acc_num AS account_num, b.rout_num AS routing_num 
                FROM account a 
                JOIN customer c ON a.customer_id = c.customer_id
                JOIN bank_account b ON a.customer_id = b.customer_id
                WHERE a.customer_id = $1
            `,
        [customerId]
      );

      if (result.rows.length > 0) {
        customerName = result.rows[0].account_name;
        transactionsHtml = result.rows
          .map((row) => {
            return `<div style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;"><p>ID: ${row.customer_id} 
                    <br> Plan: ${row.plan_name}

                    <br><br> Address: ${row.street}, ${row.city}, ${row.state} ${row.zip_code}
                    
                    <br><br> SSN: ${row.ssn} 
                    <br> Account Number: ${row.account_num} 
                    <br> Routing Number: ${row.routing_num}</p></div>`;
          })
          .join("");
      }
    } catch (err) {
      return res.status(500).send("Error: " + err.message);
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Info</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #222222;
                color: gainsboro;
                font-family: 'Sora', sans-serif;
            }
        </style>
    </head>
    <body>
        <button><a href="/database_testing">Database Testing</a></button>
        <input type="button" value="Read Me" onclick="window.open('https://github.com/hieuviet0711/3380-HW2/blob/main/README.md')" />
        <input type="button" value="Video" onclick="window.open('https://drive.google.com/file/d/1-SQh6IqL9-jXdxewI19MiOKJTGn1xVVf/view?usp=sharing')" />
        <br>
        <br>
        <form action="/details" method="GET">
            <label for="customerId">Enter Customer ID:</label>
            <input type="number" name="customerId" id="customerId" min="1" max="10" required>
            <button type="submit">Get My Info</button>
        </form>
    </body>
    </html>
  `);
});

app.get("/details", async (req, res) => {
  const customerId = req.query.customerId;
  let transactionsHtml = "";
  let customerName = "";

  if (customerId) {
    try {
      const result = await pool.query(
        `
                SELECT a.*, c.customer_ssn AS ssn, c.street_address AS street, c.city AS city, c.state AS state, c.zip AS zip_code, b.acc_num AS account_num, b.rout_num AS routing_num 
                FROM account a 
                JOIN customer c ON a.customer_id = c.customer_id
                JOIN bank_account b ON a.customer_id = b.customer_id
                WHERE a.customer_id = $1
            `,
        [customerId]
      );

      if (result.rows.length > 0) {
        customerName = result.rows[0].account_name;
        transactionsHtml = result.rows
          .map((row) => {
            return `<div style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;"><p>ID: ${row.customer_id} 
                    <br> Plan: ${row.plan_name}

                    <br><br> Address: ${row.street}, ${row.city}, ${row.state} ${row.zip_code}
                    
                    <br><br> SSN: ${row.ssn} 
                    <br> Account Number: ${row.account_num} 
                    <br> Routing Number: ${row.routing_num}</p></div>`;
          })
          .join("");
      }
    } catch (err) {
      return res.status(500).send("Error: " + err.message);
    }
  }

  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Customer Info</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: #222222;
                    color: gainsboro;
                    font-family: 'Sora', sans-serif;
                }
                ul {
                  list-style-type: none;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  background-color: #333;
                }
                
                li {
                  float: left;
                }
                
                li a {
                  display: block;
                  color: white;
                  text-align: center;
                  padding: 14px 16px;
                  text-decoration: none;
                }
                
                li a:hover:not(.active) {
                  background-color: #111;
                }
                
                .active {
                  background-color: #04AA6D;
                }
            </style>
        </head>
        <body>
        <ul>
        <li><a href="/database_testing">Database Testing</a></li>
        <li><a href="/call_log?customerId=${customerId}">Call Log</a></li>
        <li><a href="/Account_Tracker?customerId=${customerId}">Account Tracker</a></li>
        <li><a href="/change_bank?customerId=${customerId}">Banking Details</a></li>
        <li><a href="/register_call?customerId=${customerId}">Register Call</a></li>
        <li><a href="/payment?customerId=${customerId}">Payments</a></li>
      </ul>
            ${
              customerName
                ? `<h1><u>Hello ${customerName}!</u></h1>`
                : "<h2>Enter a Customer ID (1-10) to view customers details.</h2>"
            }
            <div>
                <h3>Your Information:</h3>
                ${transactionsHtml}
            </div>
                <style>
                  body {
                    background-color: #222222;
                    color: gainsboro;
                    margin: 0;
                    padding: 0;
                    position: relative;
                  }

                  .logout-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.8) 20%, rgba(0, 255, 0, 0.5) 40%, rgba(0, 255, 0, 0.8) 60%, rgba(0, 0, 255, 0.5) 80%, rgba(0, 0, 255, 0.8));
                    background-size: 200% 100%;
                    animation: wave 4s linear infinite, glow 1s ease-in-out infinite alternate;
                    color: white;
                    text-decoration: none;
                    font-weight: bold;
                    display: inline-block;
                    transition: box-shadow 0.3s ease-in-out;
                  }

                  @keyframes wave {
                    0% {
                      background-position: 0% 50%;
                    }
                    100% {
                      background-position: 100% 50%;
                    }
                  }

                  @keyframes glow {
                    0% {
                      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    }
                    100% {
                      box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5);
                    }
                  }
                </style>

                <button class="logout-button"><a href="/">Log Out</a></button>
        </body>
        </html>
    `);
});

app.get("/call_log", async (req, res) => {
  const customerId = req.query.customerId;
  let transactionsHtml = "";
  let customerName = "";

  if (customerId) {
    try {
      const result = await pool.query(
        `
                SELECT a.account_name AS name, c.call_id AS call_id, c.call_duration AS duration, c.data_usage AS usage
                FROM account a 
                JOIN call c ON a.customer_id = c.customer_id
                WHERE a.customer_id = $1
            `,
        [customerId]
      );

      if (result.rows.length > 0) {
        customerName = result.rows[0].name;
        transactionsHtml = result.rows
          .map((row) => {
            return `<li style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">Call ID: ${row.call_id} 
                    <br> Duration: ${row.duration} minutes
                    <br> Data used: ${row.usage.toFixed(2)}gb
                    </li>`;
          })
          .join("");
      }
    } catch (err) {
      return res.status(500).send("Error: " + err.message);
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Call Log</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #222222;
                color: gainsboro;
                font-family: 'Sora', sans-serif;
            }
            ul {
              list-style-type: none;
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: #333;
            }
            
            li {
              float: left;
            }
            
            li a {
              display: block;
              color: white;
              text-align: center;
              padding: 14px 16px;
              text-decoration: none;
            }
            
            li a:hover:not(.active) {
              background-color: #111;
            }
            
            .active {
              background-color: #04AA6D;
            }
        </style>
    </head>
    <body>
    <ul>
    <li><a href="/database_testing">Database Testing</a></li>
    <li><a class = "active" href="/call_log?customerId=${customerId}">Call Log</a></li>
    <li><a href="/Account_Tracker?customerId=${customerId}">Account Tracker</a></li>
    <li><a href="/change_bank?customerId=${customerId}">Banking Details</a></li>
    <li><a href="/register_call?customerId=${customerId}">Register Call</a></li>
    <li><a href="/payment?customerId=${customerId}">Payments</a></li>
  </ul>
        <h1><u>Call Log for ${customerName}:</u></h1>
        <div>
            <ol>
                ${transactionsHtml}
            </ol>
        </div>
        <style>
          body {
            background-color: #222222;
            color: gainsboro;
            margin: 0;
            padding: 0;
            position: relative;
          }

          .logout-button {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.8) 20%, rgba(0, 255, 0, 0.5) 40%, rgba(0, 255, 0, 0.8) 60%, rgba(0, 0, 255, 0.5) 80%, rgba(0, 0, 255, 0.8));
            background-size: 200% 100%;
            animation: wave 4s linear infinite, glow 1s ease-in-out infinite alternate;
            color: white;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            transition: box-shadow 0.3s ease-in-out;
          }

          @keyframes wave {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }

          @keyframes glow {
            0% {
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            100% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5);
            }
          }
        </style>

        <button class="logout-button"><a href="/">Log Out</a></button>
    </body>
    </html>
    `);
});

app.get("/Account_Tracker", async (req, res) => {
  const customerId = req.query.customerId;
  let transactionsHtml = "";
  let customerName = "";
  let totalMinutes = 0;
  let totalData = 0;

  if (customerId) {
    try {
      const result = await pool.query(
        `
                SELECT a.*, c.call_duration AS duration, c.data_usage AS usage, p.data_limit AS data_limit, p.minute_limit AS minute_limit
                FROM account a 
                JOIN call c ON a.customer_id = c.customer_id
                JOIN plan p ON a.plan_name = p.plan_name
                WHERE a.customer_id = $1
            `,
        [customerId]
      );

      if (result.rows.length > 0) {
        customerName = result.rows[0].account_name;
        result.rows.map((row) => {
          totalData += row.usage;
          totalMinutes += row.duration;
        });
        if (result.rows[0].plan_name == "Unlimited") {
          transactionsHtml = `<li> You have made ${result.rows.length} calls</li><br>
                    <li> You have spent ${totalMinutes} minutes on the phone</li><br>
                    <li> You have used ${totalData}gb of data</li><br>
                    <li> You are using a ${result.rows[0].plan_name} plan meaning you have unlimted minutes and data</li>
                    <br>`;
        } else if (
          (result.rows[0].plan_name == "Postpaid Basic" ||
            result.rows[0].plan_name == "Postpaid Upgraded") &&
          (result.rows[0].minutes_remaining == 1201 ||
            result.rows[0].data_remaining == 21)
        ) {
          transactionsHtml = `<li> You have made ${result.rows.length} calls</li><br>
                      <li> You have spent ${totalMinutes} minutes on the phone</li><br>
                      <li> You have used ${totalData}gb of data</li><br>
                      <li> You are using a ${result.rows[0].plan_name} plan and are being charged for the over draft fee since you have gone over your data or minute limit meaning you have unlimted minutes and data for the rest of the month.</li>
                      <br>`;
        } else {
          transactionsHtml = `<li> You have made ${result.rows.length} calls</li><br>
                    <li> You have spent ${totalMinutes} minutes on the phone</li><br>
                    <li> You have used ${totalData.toFixed(2)}gb of data</li><br>
                    <li> Your ${result.rows[0].plan_name} plan gives you ${result.rows[0].minute_limit} minutes meaning you have ${result.rows[0].minutes_remaining} left to use</li><br>
                    <li> Your ${result.rows[0].plan_name} plan gives you ${result.rows[0].data_limit} GB meaning you have ${result.rows[0].data_remaining.toFixed(2)} left to use</li>
                    <br>`;
        }
      }
    } catch (err) {
      return res.status(500).send("Error: " + err.message);
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Tracker</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #222222;
                color: gainsboro;
                font-family: 'Sora', sans-serif;
            }
            ul {
              list-style-type: none;
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: #333;
            }
            
            li {
              float: left;
            }
            
            li a {
              display: block;
              color: white;
              text-align: center;
              padding: 14px 16px;
              text-decoration: none;
            }
            
            li a:hover:not(.active) {
              background-color: #111;
            }
            
            .active {
              background-color: #04AA6D;
            }
        </style>
    </head>
    <body>
    <ul>
    <li><a href="/database_testing">Database Testing</a></li>
    <li><a href="/call_log?customerId=${customerId}">Call Log</a></li>
    <li><a class = "active" href="/Account_Tracker?customerId=${customerId}">Account Tracker</a></li>
    <li><a href="/change_bank?customerId=${customerId}">Banking Details</a></li>
    <li><a href="/register_call?customerId=${customerId}">Register Call</a></li>
    <li><a href="/payment?customerId=${customerId}">Payments</a></li>
  </ul>
        <h1><u>${customerName}'s Account Tracker</u></h1>
        <div style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">
            <ul>
                ${transactionsHtml}
            </ul>
        </div>
        <br>

        <style>
          body {
            background-color: #222222;
            color: gainsboro;
            margin: 0;
            padding: 0;
            position: relative;
          }

          .logout-button {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.8) 20%, rgba(0, 255, 0, 0.5) 40%, rgba(0, 255, 0, 0.8) 60%, rgba(0, 0, 255, 0.5) 80%, rgba(0, 0, 255, 0.8));
            background-size: 200% 100%;
            animation: wave 4s linear infinite, glow 1s ease-in-out infinite alternate;
            color: white;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            transition: box-shadow 0.3s ease-in-out;
          }

          @keyframes wave {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }

          @keyframes glow {
            0% {
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            100% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5);
            }
          }
        </style>

        <button class="logout-button"><a href="/">Log Out</a></button>
    </body>
    </html>
    `);
});

let stopTestCall = false;
app.get("/change_bank", async (req, res) => {
  const customerId = req.query.customerId;
  const newAccNumber = req.query.newAccNumber;
  const newRoutNumber = req.query.newRoutNumber;
  const confirmation = req.query.confirmation;
  let transactionsHtml = "";
  let buttonHtml = "";
  let customerName = "";
  let custId = "";
  if (!confirmation) {
    stopTestCall = false;
  }

  if (customerId) {
    const nameq = await pool.query(
      `SELECT account_name AS name FROM account WHERE customer_id = $1`,
      [customerId]
    );
    customerName = nameq.rows[0].name;
    custId = customerId;
  }

  if (newAccNumber && newRoutNumber && !confirmation) {
    buttonHtml = `<div style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">
        <input type="number" name="customerId" id="customerId" value=${customerId} hidden>
        <input type="number" name="newAccNumber" id="newAccNumber" value=${newAccNumber} hidden>
        <input type="number" name="newRoutNumber" id="newRoutNumber" value=${newRoutNumber} hidden>
        <h3>Entered Account Number:</h3> <p>${newAccNumber}</p>
        <h3>Entered Routing Number:</h3> <p>${newRoutNumber}</p>
        <input type="text" name="confirmation" id="confirmation" value="confirmed" hidden><button type="submit">Confirm update (to cancel, please go back to the previous page)</button>
        </div>`;
  }
  //TRANSACTION
  if (confirmation && !stopTestCall) {
    try {
      //GETS CALL SIZE THAT IS ALL
      const result = await pool.query(`SELECT COUNT(*) AS row_count FROM call`);
      //inserts
      if (result.rows.length > 0) {
        var callListsize = parseInt(result.rows[0].row_count) + 1;
      }
      //transaction that updates account and bank account for routing number
      const transactionInsert = await pool.query(
        `
          BEGIN;
            UPDATE bank_account 
            SET rout_num = ${newRoutNumber}, acc_num = ${newAccNumber}
            WHERE customer_id = ${custId};
            INSERT INTO call(call_id,customer_id,call_duration,data_usage) VALUES
            (${callListsize}, ${custId}, 0, 0);
            COMMIT;
                `
      );
      const end = await pool.query("COMMIT;");
      transactionsHtml =
        "We have updated your info and charged a test payment under a 0 minute and 0gb call to your account";
      stopTestCall = true;
    } catch (error) {
      await pool.query("ROLLBACK");
      return res.status(500).send("Error: " + error.message);
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Change Bank Information</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #222222;
                color: gainsboro;
                font-family: 'Sora', sans-serif;
            }
            ul {
              list-style-type: none;
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: #333;
            }
            
            li {
              float: left;
            }
            
            li a {
              display: block;
              color: white;
              text-align: center;
              padding: 14px 16px;
              text-decoration: none;
            }
            
            li a:hover:not(.active) {
              background-color: #111;
            }
            
            .active {
              background-color: #04AA6D;
            }
        </style>
    </head>
    <body>
    <ul>
    <li><a href="/database_testing">Database Testing</a></li>
    <li><a href="/call_log?customerId=${customerId}">Call Log</a></li>
    <li><a href="/Account_Tracker?customerId=${customerId}">Account Tracker</a></li>
    <li><a class = "active" href="/change_bank?customerId=${customerId}">Banking Details</a></li>
    <li><a href="/register_call?customerId=${customerId}">Register Call</a></li>
    <li><a href="/payment?customerId=${customerId}">Payments</a></li>
  </ul>
        <h1><u>Update Bank Information for ${customerName}:</u></h1>
        <form action="/change_bank" method="GET">
            ${
              buttonHtml
                ? buttonHtml
                : `<div style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">
                <input type="number" name="customerId" id="customerId" value=${customerId} hidden>
                <label for="newAccNumber">Enter a Account Number to change to (must be 9 digit number):</label>
                <input type="text" name="newAccNumber" id="newAccNumber" pattern="[0-9]{9}" required>
                <br>
                <label for="newRoutNumber">Enter a Routing Number to change to (must be 9 digit number):</label>
                <input type="text" name="newRoutNumber" id="newRoutNumber" pattern="[0-9]{9}" required>
                <br>
                <br>
                <button type="submit">Update bank info</button>
                </div>
                ${buttonHtml}`
            }
            </form>
        <div>
            <ul>
                ${transactionsHtml}
            </ul>
        </div>

        <style>
          body {
            background-color: #222222;
            color: gainsboro;
            margin: 0;
            padding: 0;
            position: relative;
          }

          .logout-button {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.8) 20%, rgba(0, 255, 0, 0.5) 40%, rgba(0, 255, 0, 0.8) 60%, rgba(0, 0, 255, 0.5) 80%, rgba(0, 0, 255, 0.8));
            background-size: 200% 100%;
            animation: wave 4s linear infinite, glow 1s ease-in-out infinite alternate;
            color: white;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            transition: box-shadow 0.3s ease-in-out;
          }

          @keyframes wave {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }

          @keyframes glow {
            0% {
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            100% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5);
            }
          }
        </style>

        <button class="logout-button"><a href="/">Log Out</a></button>
    </body>
    </html>
    `);
});

let stopCall = false;
app.get("/register_call", async (req, res) => {
  const customerId = req.query.customerId;
  const minutesup = req.query.minutes;
  let minutes = minutesup;
  let transactionsHtml = "";
  let buttonHtml = "";
  let customerName = "";
  let custId = "";
  let planType = "";
  let remainMinutes = 0;
  let remainData = 0.0;
  let limit = 0.0;
  let fee = 0;
  let charges = 0;
  if (!minutes) {
    stopCall = false;
  }

  if (customerId) {
    const nameq = await pool.query(
      `SELECT * FROM account WHERE customer_id = $1`,
      [customerId]
    );
    customerName = nameq.rows[0].account_name;
    planType = nameq.rows[0].plan_name;
    remainMinutes = nameq.rows[0].minutes_remaining;
    remainData = nameq.rows[0].data_remaining;
    custId = customerId;
    charges = nameq.rows[0].amount_due;
  }
  if (planType) {
    const nameq = await pool.query(
      `SELECT data_limit AS limit FROM plan WHERE plan_name = $1`,
      [planType]
    );
    limit = nameq.rows[0].limit;
  }
  //grabs data changes
  if (limit == 0) {
    dataChange = Math.round((Math.random() * 5 + 0.01) * 100) / 100;
  } else {
    dataChange = Math.round((Math.random() * (limit / 2) + 0.01) * 100) / 100;
  }

  //does the minute changes in the data
  if (minutes) {
    buttonHtml = `
        <input type="number" name="customerId" id="customerId" value=${customerId} hidden>
        <input type="number" name="minutes" id="minutes" value=${minutes} hidden>
        <h3>Entered Account Number:</h3> <p>${minutes}</p>
        <input type="text" name="confirmation" id="confirmation" value="confirmed" hidden><button type="submit">Confirm update (to cancel, please go back to the previous page)</button>
        `;
  }
  if (!stopCall) {
    if (
      remainData != 0 ||
      remainMinutes != 0 ||
      planType == "Unlimited" ||
      planType == "Postpaid Upgraded" ||
      planType == "Postpaid Basic"
    ) {
      //handles minutes changes
      if (
        (planType == "Postpaid Upgraded" || planType == "Postpaid Basic") &&
        (remainMinutes == 1201 || remainData == 21)
      ) {
        remainMinutes = remainMinutes;
        remainData = remainData;
      } else if (
        remainMinutes < minutes &&
        (planType == "Prepaid Upgraded" || planType == "Prepaid Basic")
      ) {
        minutes = remainMinutes;
        remainMinutes = 0;
      }
      //THIS WONT CHANGE
      else {
        remainMinutes -= minutes;
      }

      //RUN OUT OF MINUTES
      if (
        remainMinutes < -0.01 &&
        (planType == "Postpaid Upgraded" || planType == "Postpaid Basic")
      ) {
        fee = 100;
        remainMinutes = 1201;
        remainData = 21;
      }

      //handles data change
      if (
        (planType == "Postpaid Upgraded" || planType == "Postpaid Basic") &&
        (remainMinutes == 1201 || remainData == 21)
      ) {
        remainMinutes = remainMinutes;
        remainData = remainData;
      } else if (



        remainData < dataChange &&
        (planType == "Prepaid Upgraded" || planType == "Prepaid Basic")
      ) {
        dataChange = remainData;
        remainData = 0;

      } else {
        remainData -= dataChange;
      }


      if (
        remainData < -0.01 &&
        (planType == "Postpaid Upgraded" || planType == "Postpaid Basic")
      ) {
        fee = 100;
        remainData = 21;
        remainMinutes = 1201;
      }

      if (minutes) {
        try {
          charges += fee;

          //gets size
          const result = await pool.query(
            `SELECT COUNT(*) AS row_count FROM call`
          );
          if (result.rows.length > 0) {
            var callListsize = parseInt(result.rows[0].row_count) + 1;
          }
          //updates TRANSACTION THAT UPDATES call log and remaining minutes/data
          const transactionInsert = await pool.query(
            `
                BEGIN;
                UPDATE account 
                SET minutes_remaining = ${remainMinutes}, data_remaining = ${remainData}, amount_due = ${charges}
                WHERE customer_id = ${custId};
                INSERT INTO call(call_id, customer_id, call_duration, data_usage) VALUES
                (${callListsize}, ${custId}, ${minutes}, ${dataChange});
                COMMIT;
                    `
          );
          transactionsHtml =
            "We have registered your call of  " +
            minutes +
            " minutes and " +
            dataChange +
            "gb and have adjusted your call history with the change.";
        } catch (error) {
          await pool.query("ROLLBACK");
          return res.status(500).send("Error: " + error.message);
        }
        stopCall = true;
      }
    } else {
      transactionsHtml = "You do not have enough minutes or data to register a call";
    }
  }

  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Register Phone Call</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
          <style>
              body {
                  background-color: #222222;
                  color: gainsboro;
                  font-family: 'Sora', sans-serif;
              }
              ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
                overflow: hidden;
                background-color: #333;
              }
              
              li {
                float: left;
              }
              
              li a {
                display: block;
                color: white;
                text-align: center;
                padding: 14px 16px;
                text-decoration: none;
              }
              
              li a:hover:not(.active) {
                background-color: #111;
              }
              
              .active {
                background-color: #04AA6D;
              }
          </style>
      </head>
      <body>
      <ul>
      <li><a href="/database_testing">Database Testing</a></li>
      <li><a href="/call_log?customerId=${customerId}">Call Log</a></li>
      <li><a href="/Account_Tracker?customerId=${customerId}">Account Tracker</a></li>
      <li><a href="/change_bank?customerId=${customerId}">Banking Details</a></li>
      <li><a class = "active" href="/register_call?customerId=${customerId}">Register Call</a></li>
      <li><a href="/payment?customerId=${customerId}">Payments</a></li>
    </ul>
          <h1><u>Register a call for ${customerName}:</u></h1>
          <form action="/register_call" method="GET">
              <ol style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">
              <input type="number" name="customerId" id="customerId" value=${customerId} hidden>
              <label for="minuetes">Enter the minute duration of your call:</label>
              <input type="number" name="minutes" id="minuetes" min="0" required>
              <br><p>Please note, the data used for this call will be generated by us for you and will be displayed after you register the call</p>
              <br>
              ${transactionsHtml}
              <br>
              <button type="submit">Register this call</button>
              </ol>
          </form>
          <style>
            body {
              background-color: #222222;
              color: gainsboro;
              margin: 0;
              padding: 0;
              position: relative;
            }
  
            .logout-button {
              position: absolute;
              top: 10px;
              right: 10px;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.8) 20%, rgba(0, 255, 0, 0.5) 40%, rgba(0, 255, 0, 0.8) 60%, rgba(0, 0, 255, 0.5) 80%, rgba(0, 0, 255, 0.8));
              background-size: 200% 100%;
              animation: wave 4s linear infinite, glow 1s ease-in-out infinite alternate;
              color: white;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
              transition: box-shadow 0.3s ease-in-out;
            }
  
            @keyframes wave {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 100% 50%;
              }
            }
  
            @keyframes glow {
              0% {
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
              }
              100% {
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5);
              }
            }
          </style>
  
          <button class="logout-button"><a href="/">Log Out</a></button>
      </body>
      </html>
      `);
});
////////////////////////////////////
let stopPayment = false;
app.get("/payment", async (req, res) => {
  const customerId = req.query.customerId;
  const confirmation = req.query.confirmation;
  let transactionsHtml = "";
  let customerName = "";
  let planName;
  let paymentType;
  let money;
  let balance;
  let charges = 1;
  let remainMinutes = 0;
  let remainData = 0.0;
  let difference = 0;
  if (!confirmation) {
    stopPayment = false;
  }
  if (customerId) {
    try {
      const result = await pool.query(
        `
          SELECT a.account_name, a.plan_name, a.payment_type, p.initial_price, b.balance, a.minutes_remaining, a.data_remaining, a.amount_due
          FROM account a
          JOIN plan p ON a.plan_name = p.plan_name
          JOIN bank_account b ON a.customer_id = b.customer_id
          WHERE a.customer_id = $1
        `,
        [customerId]
      );

      if (result.rows.length > 0) {
        customerName = result.rows[0].account_name;
        planName = result.rows[0].plan_name;
        paymentType = result.rows[0].payment_type;
        money = result.rows[0].initial_price;
        balance = result.rows[0].balance;
        remainMinutes = result.rows[0].minutes_remaining;
        remainData = result.rows[0].data_remaining;
        charges = result.rows[0].amount_due;
        if (paymentType === "auto") {
          transactionsHtml = `<p>Your monthly Auto Pay payment for account ${customerName} will be processed at the end of this month for plan ${planName} ($${money}).</p>`;
        }
        //PREPAID No reason to pay overbaord
        else if (
          planName == "Prepaid Basic" &&
          remainMinutes == 400 &&
          remainData == 10
        ) {
          transactionsHtml = `<p>You have not used your minutes ${customerName}! There will be no charges for your ${planName} until the minutes or data are used.</p>`;
        } else if (
          planName == "Prepaid Upgraded" &&
          remainMinutes == 1200 &&
          remainData == 15
        ) {
          transactionsHtml = `<p>You have not used your minutes ${customerName}! There will be no charges for your ${planName} until the minutes or data are used.</p>`;
        }
        //no payments are due
        if (charges == 0) {
          transactionsHtml = `<p>You have paid your charges for the month ${customerName}.</p>`;
        } else if (balance < charges) {
          transactionsHtml = `<p>You have currently do not have enough funds in your bank to make the payment ${customerName}.</p>`;
        } else {
          if (confirmation && !stopPayment) {
            if (planName == "Prepaid Basic" && remainMinutes == 0) {
              remainMinutes = 400.0;
              remainData = 10;
            } else if (planName == "Prepaid Upgraded" && remainMinutes == 0) {
              remainMinutes = 1200.0;
              remainData = 15;
            }

            difference = balance - charges;

            const billList = await pool.query(
              `SELECT COUNT(*) AS row_count FROM payment_history`
            );
            //GET SIZE OF LIST
            var billSize = parseInt(billList.rows[0].row_count) + 1;

            //DOES THE TRANSACTION

            const transactionInsert = await pool.query(
              `
                BEGIN;
                UPDATE bank_account 
                SET balance = ${difference}
                WHERE customer_id = ${customerId};
                UPDATE account
                SET minutes_remaining = ${remainMinutes}, data_remaining = ${remainData}, amount_due = 0
                WHERE customer_id = ${customerId};
                INSERT INTO payment_history(payment_id, customer_id, account_name, amount) VALUES
                (${billSize}, ${customerId}, '${customerName}', ${charges});
                COMMIT;

              `
            );
            charges = 0;
            stopPayment = true;
          }
          transactionsHtml = `
            <p>Your current account balance is $${balance.toFixed(2)}.</p>
            <p>Your monthly payment for plan ${planName} is $${charges}. Click the button below to proceed with the payment:</p>
            <form action="/payment" method="GET">
              <input type="number" name="customerId" id="customerId" value=${customerId} hidden>
              <input type="text" name="confirmation" id="confirmation" value="confirmed" hidden>
              <button type="submit" id="payNowBtn">Pay Now</button>
            </form>
              `;
        }
        if (charges == 0) {
          transactionsHtml = `<p>You have paid your charges for the month ${customerName}.</p>`;
        } else if (balance < money) {
          transactionsHtml = `<p>You have currently do not have enough funds in your bank to make the payment ${customerName}.</p>`;
        }
      }
    } catch (err) {
      await pool.query("ROLLBACK");
      return res.status(500).send("Error: " + err.message);
    }
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
      <style>
        body {
          background-color: #222222;
          color: gainsboro;
          font-family: 'Sora', sans-serif;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #333;
        }
        
        li {
          float: left;
        }
        
        li a {
          display: block;
          color: white;
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
        }
        
        li a:hover:not(.active) {
          background-color: #111;
        }
        
        .active {
          background-color: #04AA6D;
        }
      </style>
    </head>
    <body>
    <ul>
    <li><a href="/database_testing">Database Testing</a></li>
    <li><a href="/call_log?customerId=${customerId}">Call Log</a></li>
    <li><a href="/Account_Tracker?customerId=${customerId}">Account Tracker</a></li>
    <li><a href="/change_bank?customerId=${customerId}">Banking Details</a></li>
    <li><a href="/register_call?customerId=${customerId}">Register Call</a></li>
    <li><a class = "active" href="/payment?customerId=${customerId}">Payments</a></li>
  </ul>
      <h1><u>Payment Confirmation</u></h1>
      ${customerName ? `<h2>Hello ${customerName}!</h2>` : ""}
        <div style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">
      ${transactionsHtml}
      </div>
      <br>
      <br>
          <style>
            body {
              background-color: #222222;
              color: gainsboro;
              margin: 0;
              padding: 0;
              position: relative;
            }
  
            .logout-button {
              position: absolute;
              top: 10px;
              right: 10px;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.8) 20%, rgba(0, 255, 0, 0.5) 40%, rgba(0, 255, 0, 0.8) 60%, rgba(0, 0, 255, 0.5) 80%, rgba(0, 0, 255, 0.8));
              background-size: 200% 100%;
              animation: wave 4s linear infinite, glow 1s ease-in-out infinite alternate;
              color: white;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
              transition: box-shadow 0.3s ease-in-out;
            }
  
            @keyframes wave {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 100% 50%;
              }
            }
  
            @keyframes glow {
              0% {
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
              }
              100% {
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5);
              }
            }
          </style>
  
          <button class="logout-button"><a href="/">Log Out</a></button>
    </body>
    </html>
  `);
});

////////////////////////////////////////////
app.get("/database_testing", async (req, res) => {
  const action = req.query.action;
  let transactionsHtml = "";

  if (action) {
    if (action == "erase") {
      drop();
      transactionsHtml =
        "The database has been wiped, refer to the label, you will need to reset the data to not get an error when you reenter the app";
    } else if (action == "reset") {
      initialize();
      transactionsHtml =
        "The database has been reset with the original testing data";
    } else {
      transactionsHtml = "No changes were applied to the database";
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Testing</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #222222;
                color: gainsboro;
                font-family: 'Sora', sans-serif;
            }
        </style>
    </head>
    <body>
        <h1>Database Testing:</h1>
        <form action="/database_testing" method="GET" style="border: 2px solid white; border-radius: 8px; padding: 5px; display: inline-block; margin: 3px;">
            <input type="radio" name="action" id="erase" name="action" value="erase">
            <label for="erase">Erase all database (once you reenter the app you will get errors because there is no data obviously, this is a failing test, restart server to restart the app with data)</label>
            <br>
            <input type="radio" name="action" id="reset" name="action" value="reset">
            <label for="reset">Resets database to original starter data</label>
            <br>
            <input type="radio" name="action" id="none" name="action" value="none">
            <label for="reset">Make no changes to the database</label>
            <br>
            <button type="submit">Test</button>
        </form>
        <div>
            <ul>
                ${transactionsHtml}
            </ul>
        </div>
        <button><a href="/">Go back with made changes</a></button>
    </body>
    </html>
    `);
});

app.listen(port, () => {
  initialize();
  console.log(`Server running at http://localhost:${port}/`);
});
