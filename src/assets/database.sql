CREATE DATABASE smart_irrigation;
CREATE USER iot_user WITH PASSWORD 'iot_password';
GRANT ALL PRIVILEGES ON DATABASE smart_irrigation TO iot_user;

-- creating the tables needed for iot;

-- table for sensor data
CREATE TABLE sensor_data(
    id SERIAL PRIMARY KEY,
    sensor_type VARCHAR(50) NOT NULL,
    value NUMERIC NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- table for users
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- table for irrigation settings

CREATE TABLE irrigation_settings(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id)
    start_time TIME,
    endt_ime TIME,
    min_moisture_level NUMERIC
);

DELETE FROM users WHERE username = 'iot_user';
INSERT INTO users(username , password) VALUES ('postgres','Abhinav@123');
INSERT INTO sensor_data (sensor_type,value) VALUES ('Temperature', 28.5);

SELECT * FROM sensor_data;


SELECT * FROM users;