# Pedro Carlos - 3D Interactive Portfolio

A unique and immersive 3D portfolio website built with Babylon.js that presents professional information in an engaging virtual corkboard environment.

## 🎯 Overview

This interactive portfolio breaks away from traditional flat web design by creating a realistic 3D corkboard where skills, programming languages, and personal information are displayed as physical objects - photos, labels, post-it notes, and pins - all connected with virtual rope in a visually stunning environment.

## ✨ Features

### 🎮 Interactive 3D Environment
- **Physics-enabled scene** using Ammo.js for realistic object interactions
- **Virtual corkboard** with cork texture and wooden frame
- **Dynamic camera controls** for exploring the 3D space
- **Realistic lighting** and shadows

### 📸 Portfolio Elements
- **Profile photo** with realistic frame and pin attachment
- **Programming language showcase** featuring logos of:
  - Java, JavaScript, HTML
  - C, Go, Assembly
  - SQL, Erlang, Rust
  - OCaml, Python
  - And many more!
- **Skills display** organized into soft and hard skills
- **Post-it notes** for detailed skill descriptions
- **Connected elements** using virtual rope between related items

### 🎨 Visual Design
- **Authentic textures** including cork, wood, and tape
- **Realistic pin physics** with natural tilting for single-pin items
- **Handwritten-style fonts** for labels and text
- **White photo frames** with proper depth and materiality

## 🛠️ Technical Stack

- **Frontend Framework**: Pure JavaScript with Babylon.js
- **3D Engine**: Babylon.js
- **Physics Engine**: Ammo.js (WebAssembly)
- **Styling**: CSS3
- **Fonts**: Google Fonts (Playwrite HU)

## 🏗️ Architecture

### Core Components
- `main.js` - Scene initialization and physics setup
- `objects/` - Modular 3D object creators:
  - `corkboard.js` - Main background surface
  - `photo.js` - Framed images with pin attachments  
  - `pin.js` - Interactive pin objects
  - `label.js` - Text labels with frames
  - `postit.js` - Sticky note elements
  - `rope.js` - Connecting rope between elements
  - `camera.js` - Camera controls and movement

### Asset Organization
- `assets/logos/` - Programming language logos (100+ languages)
- `assets/textures/` - Material textures (cork, wood, tape)
- `assets/pedro.webp` - Profile photo

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Local web server (for proper asset loading)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pedro-carlos/pedro-carlos.github.io.git
cd pedro-carlos.github.io
```

2. Serve the files using a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using Live Server extension in VS Code
# Right-click index.html → "Open with Live Server"
```

3. Open your browser and navigate to `http://localhost:8000`

## 🎮 Usage

- **Mouse/Trackpad**: Navigate around the 3D scene
- **Scroll**: Zoom in/out
- **Drag**: Rotate camera view
- **Interactive Elements**: Explore the corkboard to discover skills and technologies

## 🔧 Customization

### Adding New Programming Languages
1. Add logo files to `assets/logos/`
2. Update the `languages` array in `main.js`
3. Position new language photos in the 3D space

### Modifying Skills
- Edit the `softSkills` string in `main.js`
- Adjust post-it note positioning and content

### Changing Textures
- Replace files in `assets/textures/`
- Update material references in object files

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🔮 Future Enhancements

- [ ] Optimize texture file sizes for faster loading
- [ ] Add animation transitions between portfolio sections
- [ ] Include interactive project showcases
- [ ] Add audio feedback for interactions
- [ ] Mobile-responsive touch controls

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📞 Contact

Visit the live portfolio at [pedro-carlos.github.io](https://pedro-carlos.github.io) to explore the full 3D experience.

---

*Built with ❤️ and Babylon.js - Bringing portfolios into the third dimension*
