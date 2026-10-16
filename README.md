# 🚽 When to Pee 💧

A fun, interactive web application for hackathons that calculates when you'll need to use the bathroom based on your water intake!

## 🎯 Features

### 📊 Interactive Calculations
- **Water Intake Tracking**: Log your water consumption with amount and temperature
- **Drink Type Selection**: Choose from Water, Coffee, Tea, Soda, Juice, or Alcohol (each affects processing time differently!)
- **Urine Production Timeline**: Calculates when water will turn into urine (5-120 minutes based on factors)
- **Bladder Capacity Estimation**: Based on your weight (7 mL per kg formula)
- **Hold Time Calculations**: Safe hold time (3-5 hours) and maximum hold time (6-8 hours)
- **Urgency Indicator**: Color-coded gauge showing urgency level

### 📈 Interactive Visualizations
- **4 Chart.js Graphs**:
  - 🫧 Bladder Capacity (doughnut chart)
  - 📊 Urine Production Timeline (line chart)
  - 💧 Daily Water Intake (bar chart)
  - ⏱️ Hold Time vs Volume (area chart)

### 🎨 Fun Animations
- Rainbow gradient background animation
- Floating particle system
- Bouncing water drops
- Pulsing urgency indicators
- Wiggling, bouncing, and glowing effects
- Confetti celebrations
- Real-time bladder fill animation

### 🔊 Funny Sound Effects
- Slurp, boing, toot, and water sounds
- Random funny sounds on interactions
- Celebration sounds for achievements
- Special submission sound with ascending scale
- Toggle sound on/off

### 🎮 Gamification
- **4 Achievement Badges**: First Log, Well Hydrated, Hydration Champion, Consistent
- **Daily Water Goals**: Based on your weight (35 mL per kg)
- **Progress Tracking**: See how close you are to your daily goal
- **Auto-Submit**: Automatically saves data every 5 minutes

### 💾 Data Persistence
- Local storage for user profile (height, weight, age)
- Intake history tracking
- Submit button to save all data
- Auto-save functionality

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Running the App

1. **Clone the repository**:
```bash
git clone https://github.com/jk17ad/funnathon.git
cd funnathon/whentopee
```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
```bash
python3 -m http.server 8080
```
   Then visit `http://localhost:8080`

## 🎮 How to Use

1. **Enter Your Info**:
   - Adjust water amount you drank
   - Select water temperature
   - Choose drink type (affects processing time!)
   - Enter your height, weight, and age
   - Select your current hydration status

2. **View Results**:
   - See urine production time
   - Check bladder capacity
   - View safe and maximum hold times
   - Monitor urgency level

3. **Track Intake**:
   - Click "Add to Today's Log" to record water intake
   - Watch the charts update in real-time
   - See your bladder fill animation

4. **Submit Data**:
   - Click "Submit & Save Data" to save your information
   - Enjoy the funny sound effects and confetti!
   - Data auto-saves every 5 minutes

5. **Earn Badges**:
   - Log your first drink
   - Reach your daily water goal
   - Drink 3x your daily goal
   - Log 5+ drinks in a day

## 🧮 Calculations

### Urine Production Time
- Base: 20 minutes
- Temperature modifier: Ice cold (+10%) to Hot (-10%)
- Hydration modifier: Well-hydrated (-20%) to Dehydrated (+50%)
- Drink type modifier:
  - Water: 1.0x (baseline)
  - Coffee: 0.7x (diuretic)
  - Tea: 0.8x (mild diuretic)
  - Soda: 0.85x (caffeine + sugar)
  - Juice: 1.1x (slower due to sugar)
  - Alcohol: 0.5x (strong diuretic)

### Bladder Capacity
- Formula: 7 mL per kg of body weight
- Adult baseline: 500 mL
- Age adjustment: Slight decrease with age

### Hold Time
- Safe: 3-5 hours
- Maximum: 6-8 hours (emergency only)

## ⚠️ Disclaimer

This application is for **educational and hackathon purposes only**. It is **not medical advice**. Always consult a healthcare professional for medical concerns about hydration and bladder health.

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Logic and interactivity
- **Chart.js** - Interactive graphs
- **Web Audio API** - Sound effects
- **Local Storage API** - Data persistence

## 🎨 Design Features

- Playful, fun aesthetic
- Glassmorphism card effects
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Color-coded urgency indicators
- Emoji-rich interface

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## 🤝 Contributing

This is a hackathon project, but feel free to fork and improve it!

## 📄 License

This project is open source and available for educational purposes.

## 🎉 Hackathon Notes

Perfect for hackathons because:
- ✅ Visually engaging with lots of animations
- ✅ Interactive with real-time calculations
- ✅ Fun sound effects and gamification
- ✅ Educational yet entertaining
- ✅ Fully functional with no backend required
- ✅ Responsive and works on all devices

---

Made with 💧 for Hackathon | Not medical advice 🚨
