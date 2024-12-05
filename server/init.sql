CREATE DATABASE IF NOT EXISTS area;
USE area;

-- Grant all privileges to root user from any host
GRANT ALL PRIVILEGES ON area.* TO 'root'@'%' IDENTIFIED BY 'root';
FLUSH PRIVILEGES; 