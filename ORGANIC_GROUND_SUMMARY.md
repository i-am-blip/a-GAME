# 🎨 Visual Polish: Seamless & Organic Ground

## ✨ Improvements

### 1. **Seamless Surface**
- **Issue**: Standard tileset blocks have borders, creating visible vertical lines on continuous platforms.
- **Fix**: Implemented sub-pixel cropping in the render loop.
  - **Left Tile**: Cropped Right border.
  - **Mid Tiles**: Cropped Left and Right borders.
  - **Right Tile**: Cropped Left border.
- **Result**: Grass surfaces now connect perfectly without black seams, creating a true "conveyor belt" look.

### 2. **Organic Earth Fill**
- **Issue**: Dirt fill was a repeating grid of identical tiles.
- **Fix**: Implemented deterministic noise-based rotation.
  - Each dirt tile is randomly rotated (0°, 90°, 180°, 270°) based on its coordinate seed.
  - Dirt tiles are also cropped to remove their internal borders.
- **Result**: The underground earth looks like a natural, chaotic mass rather than a tiled wallpaper.

## 🛠️ Implementation Details
- Modified `draw()` loop to use `ctx.drawImage` with 9 arguments for precise source rectangle selection.
- Used `ctx.translate` and `ctx.rotate` for dirt randomization.
