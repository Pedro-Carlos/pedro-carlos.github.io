# Pedro Carlos - 3D Interactive Portfolio

> A creative 3D cork board portfolio showcasing my professional journey as a Computer Science student and Full-Stack Developer.

## 🌟 Live Demo

Visit the live portfolio at: [pedro-carlos.github.io](https://pedro-carlos.github.io)

## 🎯 About

This interactive portfolio is designed as a virtual cork board where visitors can explore my professional background, skills, and experience through an immersive 3D environment. The project demonstrates both my technical skills and creative approach to web development.

## ✨ Features

### 🎮 Interactive 3D Elements
- **3D Cork Board**: Realistic cork board with wooden frame and physics simulation
- **Interactive Navigation**: Mouse/touch controls for camera movement
- **Physics Engine**: Ammo.js integration for realistic object interactions
- **Mobile Support**: Gyroscope controls for mobile devices

### 📋 Portfolio Content
- **Professional Photo**: Personal introduction with visual appeal
- **Skills Display**: 
  - Programming languages with visual logos
  - Soft skills overview
  - Spoken languages with flag indicators
- **Education**: University information with institution branding
- **Work Experience**: Detailed breakdown of professional roles
- **Contact Information**: Direct links to LinkedIn and GitHub profiles

### 🎨 Creative Elements
- **Post-it Notes**: Information displayed on realistic sticky notes
- **Pins & Ropes**: Visual connections between related content sections
- **Download Buttons**: Interactive CV download in Portuguese and English
- **Clickable Links**: Direct navigation to social media profiles and company websites

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic structure and canvas element
- **CSS3**: Responsive styling and mobile optimizations
- **JavaScript**: Interactive functionality and object management

### 3D Graphics & Physics
- **Babylon.js**: 3D rendering engine and scene management
- **Ammo.js**: Physics simulation for realistic interactions
- **Babylon.js GUI**: User interface elements within the 3D scene

### External Resources
- **Google Fonts**: Playwrite HU font family
- **FontFace Observer**: Font loading management
- **WebGL**: Hardware-accelerated 3D graphics

## 🏗️ Project Structure

```
pedro-carlos.github.io/
├── index.html              # Main HTML file
├── main.js                 # Core application logic
├── style.css               # Global styles
├── objects/                # 3D object components
│   ├── camera.js           # Camera controls and movement
│   ├── corkboard.js        # Main cork board creation
│   ├── downloadButton.js   # CV download functionality
│   ├── label.js            # Text labels and signs
│   ├── photo.js            # Photo frames and images
│   ├── pin.js              # Cork board pins
│   ├── postit.js           # Post-it note elements
│   └── rope.js             # Connecting ropes between pins
├── assets/                 # Static resources
│   ├── CV/                 # Resume files (PT/EN)
│   ├── flags/              # Country flags
│   ├── logos/              # Technology and company logos
│   ├── textures/           # 3D textures (cork, wood)
│   └── pedro.webp          # Personal photo
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Local web server (for development)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pedro-carlos/pedro-carlos.github.io.git
   cd pedro-carlos.github.io
   ```

2. **Serve locally**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000

   # Using Visual Studio Live Server
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

### Development

The project uses vanilla JavaScript with modular object files. Each component in the `objects/` directory is responsible for creating specific 3D elements:

- Modify `main.js` for overall scene setup and object positioning
- Edit individual object files for specific component behavior
- Update `style.css` for visual styling and responsive design
- Replace assets in `assets/` directory to customize content

## 📱 Mobile Support

The portfolio includes mobile-optimized features:
- **Touch Navigation**: Swipe and pinch gestures for camera control
- **Gyroscope Integration**: Device orientation for immersive navigation
- **Responsive Design**: Adaptive layout for different screen sizes
- **Performance Optimization**: Efficient rendering for mobile devices

## 🎯 Key Interactive Features

### Navigation
- **Mouse Controls**: Click and drag to rotate view, scroll to zoom
- **Touch Controls**: Pinch to zoom, swipe to rotate on mobile
- **Gyroscope**: Tilt device for natural camera movement (mobile)

### Clickable Elements
- **Social Media Links**: Direct navigation to LinkedIn and GitHub
- **CV Downloads**: Instant download of resume in Portuguese or English
- **Company Links**: Visit websites of previous employers

### Visual Connections
- **Pin-and-Rope System**: Visual relationships between content sections
- **Color-Coded Elements**: Consistent visual hierarchy
- **Realistic Physics**: Objects respond to interactions naturally

## 🌐 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Optimized support with touch/gyroscope controls

## 🤝 Contact

**Pedro Carlos**
- 📧 Email: pedrocarlos650@gmail.com
- 💼 LinkedIn: [pedro-carlos-028417268](https://www.linkedin.com/in/pedro-carlos-028417268/)
- 🐱 GitHub: [PedroCarlos-FCT](https://github.com/PedroCarlos-FCT) | [Pedro-Carlos](https://github.com/Pedro-Carlos)

---

*Built with pleasure and creativity using Babylon.js*
