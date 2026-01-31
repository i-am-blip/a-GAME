# 🎮 Pixel Platformer Game

A retro-style platformer game built with vanilla JavaScript and HTML5 Canvas, featuring pixel art graphics from Kenney's asset pack.

## 🎯 Features

- **Smooth Player Movement**: Left/Right arrow keys for movement
- **Jump Mechanics**: Space bar or Up arrow to jump
- **Physics Engine**: Realistic gravity and collision detection
- **Platform Collision**: Precise collision detection with multiple platforms
- **Collectibles**: Coins to collect for points
- **Lives System**: 3 lives with respawn functionality
- **Score Tracking**: Track your progress
- **Animated Sprites**: Character animations and coin rotations
- **Beautiful UI**: Premium retro gaming aesthetic with gradients and effects

## 🎮 Controls

- **← →** - Move Left/Right
- **SPACE** or **↑** - Jump
- **🔄 Restart Button** - Reset the game

## 🚀 How to Play

### Option 1: Direct File Opening
1. Simply double-click `index.html` to open it in your default browser
2. Start playing immediately!

### Option 2: Local Server (Recommended for best performance)
If you have Python installed:
```bash
python -m http.server 8000
```

If you have Node.js installed:
```bash
npx -y http-server -p 8000
```

Then open your browser to: `http://localhost:8000`

## 🎨 Game Mechanics

### Player Physics
- **Gravity**: 0.6 units per frame
- **Jump Force**: 12 units
- **Movement Speed**: 4 pixels per frame
- **Max Fall Speed**: 15 units

### Collision System
The game features a robust AABB (Axis-Aligned Bounding Box) collision detection system that:
- Detects collisions from all four sides (top, bottom, left, right)
- Resolves collisions based on minimum overlap
- Allows smooth platform landing and wall sliding
- Prevents player from falling through platforms

### Level Design
- Multiple platforms at different heights
- Strategic coin placement to encourage exploration
- Ground platform to prevent falling infinitely
- Challenging jumps requiring precise timing

## 🏆 Scoring
- Each coin collected: **+100 points**
- Try to collect all coins!

## 💡 Tips
- Time your jumps carefully to reach higher platforms
- Collect all coins for maximum score
- Don't fall off the bottom of the screen or you'll lose a life!
- Use the momentum from running to make longer jumps

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic and physics
- **CSS3** - Premium UI styling with animations
- **Kenney Pixel Platformer Assets** - Individual sprite tiles (18x18 for tiles, 24x24 for characters)

### Code Structure
- `index.html` - Main HTML structure
- `style.css` - Premium styling with retro aesthetics
- `game.js` - Complete game engine with physics and collision detection
- `kenney_pixel-platformer/Tiles/` - Individual tile sprites
- `kenney_pixel-platformer/Tiles/Characters/` - Character sprites
- `kenney_pixel-platformer/Tiles/Backgrounds/` - Background elements

### Key Features in Code
- **Game Loop**: RequestAnimationFrame for smooth 60 FPS
- **Sprite System**: Individual tile assets loaded and rendered separately
- **State Management**: Clean game state handling
- **Input System**: Keyboard event handling with key state tracking
- **Animation System**: Frame-based sprite animation

## 📝 Future Enhancements (Ideas)
- Enemy AI and obstacles
- Multiple levels
- Power-ups and special abilities
- Sound effects and background music
- Mobile touch controls
- High score persistence (localStorage)
- Parallax scrolling backgrounds

## 📄 License
Game code is free to use. Assets are from Kenney (CC0 License) - see `kenney_pixel-platformer/License.txt`

## 🎉 Enjoy!
Have fun playing! Try to beat your high score and collect all the coins!
