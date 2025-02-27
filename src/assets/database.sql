select * from users;
delete from password_reset_token where id=1;
INSERT INTO users(username,password,name,email) VALUES ('testuser','$2b$12$EfmfB5aPG.SqTgbO.6Qdle1hKd0KcfBsLdRTJBPuJ7kEOrdLUquCS','USER','testuser@gmai;')


INSERT INTO sensor_data (sensor_type, value) VALUES 
('Temperature', 25.6),
('Temperature', 30.2),
('Temperature', 22.4),
('Humidity', 60.5),
('Humidity', 70.1),
('Humidity', 55.2),
('SoilMoisture', 35.8),
('SoilMoisture', 45.3),
('SoilMoisture', 28.7);


CREATE TABLE user_crop_edits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    crop_id INT,
    field_name VARCHAR(255),
    edited_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(user_id, crop_id, field_name),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);
