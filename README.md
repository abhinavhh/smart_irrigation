
# SolidFlow 🌿💧  
**Intelligent Agricultural Automation System**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.4-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://react.dev/)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-blueviolet.svg)](https://vitejs.dev/)

![SolidFlow System Overview](https://via.placeholder.com/1200x400.png?text=SolidFlow+System+Demo)  
*(Replace with high-quality system overview graphic)*

## Table of Contents
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Key Features 🔍

### 🌐 Core Functionality
- **Smart Irrigation Automation**  
  Precision watering based on real-time sensor analysis and user-defined parameters
- **Multi-Dimensional Threshold Management**  
  Customizable min/max values for temperature, humidity, and soil moisture
- **Adaptive Scheduling System**  
  Time-based irrigation control with automatic/manual mode switching

### 📊 Data Visualization
- **Real-Time Sensor Dashboard**  
  Live monitoring of temperature, humidity, and soil moisture levels
- **Advanced Analytics Engine**  
  - 24-hour granular data tracking  
  - Weekly/Monthly aggregated reports  
  - Multi-sensor comparative analysis
- **Predictive Trend Analysis**  
  Machine learning-powered irrigation recommendations

### 🔒 Security & User Management
- JWT-based Authentication System
- OTP-verified Password Reset Workflow
- Role-based Access Control (RBAC)
- End-to-end Encrypted Communications

### ⚙️ Device Integration
- ESP32/Arduino Microcontroller Support
- REST API for IoT Device Management
- WebSocket-based Real-time Communication
- Sensor Calibration Interface

## Technology Stack 🛠️

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite 4 |
| State Management | React Context API |
| Data Visualization | Chart.js 4 + D3.js 7 |
| UI Library | Material-UI 5 |
| Routing | React Router 6 |
| Form Handling | React Hook Form 7 |

### Backend
| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.1 |
| Security | Spring Security 6 + JWT |
| Persistence | Spring Data JPA + PostgreSQL 15 |
| Real-time | WebSocket (STOMP) |
| Email | JavaMail + Thymeleaf |
| Testing | JUnit 5 + Mockito 5 |

### Infrastructure
| Component | Technology |
|-----------|------------|
| CI/CD | GitHub Actions |
| Containerization | Docker 24 + Docker Compose |
| Monitoring | Prometheus + Grafana |
| Logging | ELK Stack |

## System Architecture 🏗️

graph TD
    A[IoT Sensors] -->|BLE/WiFi| B(Microcontroller)
    B -->|MQTT| C[Spring Boot API]
    C --> D[(PostgreSQL)]
    C -->|WebSocket| E[React Frontend]
    C --> F[SMTP Server]
    E --> G[User Browser]
    C --> H[Redis Cache]
    C --> I[Scheduler Service]
    
    style A fill:#4CAF50,stroke:#388E3C
    style B fill:#2196F3,stroke:#1976D2
    style C fill:#607D8B,stroke:#455A64
    style E fill:#FF5722,stroke:#E64A19

## Installation ⚡

### Prerequisites
- Java Development Kit 17+
- Node.js 18.x
- PostgreSQL 15+
- Maven 3.9+

### Backend Setup
# Clone repository
git clone https://github.com/yourusername/solidflow.git
cd solidflow/backend

# Build application
mvn clean install

# Configure environment
cp .env.example .env
nano .env

# Start application
java -jar target/solidflow-*.jar

### Frontend Setup
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env

# Start development server
npm run dev

## Configuration ⚙️

### Backend (.env)
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/solidflow
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=strongpassword

# JWT Configuration
JWT_SECRET=your_512bit_secret_here
JWT_EXPIRATION=86400000  # 24h

# Email Configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your.email@domain.com
SPRING_MAIL_PASSWORD=app_specific_password

# WebSocket
WEBSOCKET_ENDPOINT=/api/ws
STOMP_BROKER=/topic

## API Documentation 📚

Explore our comprehensive API documentation:  
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui.html)

GET /api/sensors
Authorization: Bearer {token}

{
  "temperature": 23.5,
  "humidity": 65,
  "soilMoisture": 42,
  "timestamp": "2023-10-15T14:30:00Z"
}


## Contributing 🤝

We welcome contributions! Please follow these guidelines:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request with detailed description

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📬

**Agricultural Technology Team**  
[![Email](https://img.shields.io/badge/Email-support%40solidflow.tech-blue)](mailto:support@solidflow.tech)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-SolidFlow-blue)](https://linkedin.com/company/solidflow)  

**Technical Lead**  
John Doe - [@john_doe_dev](https://twitter.com/john_doe_dev)

---

**Built with ❤️ using Open Source**  
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![Spring](https://img.shields.io/badge/-Spring-6DB33F?logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
```