# SolidFlow - Smart Irrigation System 🌱💧

![SolidFlow Banner](https://via.placeholder.com/800x200.png?text=SolidFlow+Smart+Irrigation+System) 
*(Replace with actual project banner)*

A web-based smart irrigation system that automates plant watering based on real-time sensor data and user-defined parameters.

## 🌟 Features

### **User Authentication**
- Secure JWT-based authentication
- Login with username/password
- Registration with email verification
- Password reset via OTP
- Forgot password functionality

### **Real-Time Dashboard**
- Live sensor data visualization (Temperature, Humidity, Soil Moisture)
- WebSocket-based real-time updates
- Quick view cards with threshold status indicators
- Add/Edit crops with predefined thresholds
- Control panel navigation for each crop

### **Smart Irrigation Control**
- Automatic watering based on:
  - Sensor thresholds (min/max values)
  - User-defined time schedules
- Manual valve control override
- Irrigation mode selector:
  - Automatic
  - Manual
  - Scheduled

### **Data Visualization**
- Individual sensor graphs (24hrs/Week/Month)
- Comparative analytics dashboard
- Historical data trends
- Average value calculations:
  - Daily averages for weekly view
  - Weekly averages for monthly view

### **Crop Management**
- Predefined crop database with optimal thresholds
- Custom threshold configuration
- Multi-crop support
- Threshold boundary notifications

### **Notification System**
- Real-time alerts for:
  - Threshold breaches
  - Irrigation system activations
  - Schedule reminders
- Historical notification log

### **User Profile**
- Personal information management
- Email & username updates
- Password reset functionality
- Session management

## 🛠️ Technologies Used

### **Frontend**
- React Vite
- React Router
- Chart.js (Data Visualization)
- WebSocket Client
- React-Hook-Form
- Material-UI / Ant Design

### **Backend**
- Spring Boot
- Spring Security
- WebSocket (STOMP)
- Spring Data JPA
- H2 Database (Development) / PostgreSQL (Production)
- JWT Authentication
- Java Mail (OTP Service)

### **Hardware Integration**
- DHT11 (Temperature/Humidity Sensor)
- Soil Moisture Sensor
- ESP32/Arduino Microcontroller
- Relay-controlled Water Valve

## 🚀 Installation

### **Prerequisites**
- Java 17+
- Node.js 16+
- PostgreSQL (for production)
- Maven

### **Backend Setup**
```bash
cd solidflow-backend
mvn clean install
java -jar target/solidflow-0.0.1-SNAPSHOT.jar