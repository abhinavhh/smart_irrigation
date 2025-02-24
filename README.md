# 🌱 Smart IoT-Enabled Drip Irrigation System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Blynk](https://img.shields.io/badge/Blynk-IoT-brightgreen.svg)](https://blynk.io/)
[![ESP32](https://img.shields.io/badge/ESP32-Ready-orange.svg)](https://www.espressif.com/)

An intelligent irrigation system leveraging ESP32 and Blynk app to automate plant watering through environmental sensor data.

## 📋 Table of Contents

- [Features](#features)
- [System Components](#system-components)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing Results](#testing-results)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

- 🤖 Automated drip irrigation based on soil moisture and temperature
- 📱 Real-time monitoring through Blynk mobile app
- 🔌 Multiple sensor integration:
  - 💧 Soil moisture sensor
  - 🌡️ Temperature sensor
  - 💨 Air humidity sensor
  - 🌊 Water flow sensor
- 🎮 Manual override capability
- 🔔 Automatic notifications for extreme humidity conditions
- 📊 Data visualization through Blynk app
- ⚡ Flow rate-based watering duration calculation

## 🛠️ System Components

### Hardware
```
├── ESP32 microcontroller
├── Sensors
│   ├── Soil moisture sensor
│   ├── Temperature sensor
│   ├── Air humidity sensor
│   └── Water flow sensor
├── Solenoid valve
└── Drip irrigation equipment
```

### Software
```
├── Blynk IoT platform
├── Frontend Repository
└── Backend Repository
```

## 💻 Installation

1. **Clone the repositories:**
   ```bash
   # Clone frontend repository
   git clone [frontend-repo-url]
   
   # Clone backend repository
   git clone [backend-repo-url]
   ```

2. **Install dependencies:**
   ```bash
   # Frontend dependencies
   cd frontend
   npm install

   # Backend dependencies
   cd ../backend
   npm install
   ```

3. **Setup Blynk:**
   - Download Blynk app from App Store/Play Store
   - Create new project
   - Copy authentication token

## ⚙️ Configuration

### ESP32 Pin Configuration
```
┌─────────────────────┬───────────┐
│ Sensor/Component    │ GPIO Pin  │
├─────────────────────┼───────────┤
│ Soil Moisture      │ GPIO 36   │
│ Temperature        │ GPIO 39   │
│ Humidity          │ GPIO 34   │
│ Water Flow        │ GPIO 35   │
│ Solenoid Valve    │ GPIO 32   │
└─────────────────────┴───────────┘
```

### Environment Setup
1. Create `.env` file in backend directory:
   ```env
   WIFI_SSID=your_wifi_ssid
   WIFI_PASSWORD=your_wifi_password
   BLYNK_AUTH_TOKEN=your_blynk_token
   ```

2. Configure sensor thresholds in `config.json`:
   ```json
   {
     "soilMoistureThreshold": 500,
     "temperatureThreshold": 30,
     "humidityThreshold": {
       "min": 30,
       "max": 80
     }
   }
   ```

## 📱 Usage

### Initial Setup
1. Power up the ESP32 system
2. Connect to configured WiFi network
3. Launch Blynk app
4. Connect to your project

### Monitoring
- View real-time sensor data:
  - Soil moisture levels
  - Temperature readings
  - Humidity values
  - Water flow rates

### Control
- **Manual Mode:**
  - Toggle automatic watering
  - Trigger manual irrigation
  - Set custom watering duration

- **Automatic Mode:**
  - System waters based on sensor readings
  - Adjusts watering duration using flow rate
  - Sends notifications for extreme conditions

## 🧪 Testing Results

### Primary Testing
- ✅ System functionality verified
- ✅ Sensor accuracy confirmed
- ✅ Communication reliability tested

### Field Testing
- ✅ Successful growth of green onions
- ✅ Automatic watering cycles performed as expected
- ✅ Data logging and visualization functional

## 🔍 Troubleshooting

### Common Issues

#### 1. Sensor Reading Errors
```
Problem: Inconsistent or invalid sensor readings
Solution: 
├── Check physical connections
├── Verify power supply
└── Recalibrate sensors if needed
```

#### 2. Connection Issues
```
Problem: Blynk app not connecting
Solution:
├── Verify WiFi connection
├── Check auth token
└── Restart ESP32
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/repo-name](https://github.com/yourusername/repo-name)

---

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/repo-name&type=Date)](https://star-history.com/#yourusername/repo-name&Date)
