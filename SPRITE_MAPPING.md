# Sprite Asset Mapping

This document details the exact sprites used from the Kenney Pixel Platformer asset pack.

## Asset Information

### Tile Specifications
- **Platform Tiles**: 18px × 18px (with 1px spacing in tilemap)
- **Character Sprites**: 24px × 24px (with 1px spacing in tilemap)
- **Background Tiles**: 18px × 18px

## Sprites Used in Game

### Character Sprites
**Location**: `kenney_pixel-platformer/Tiles/Characters/`

- **tile_0000.png** - Green character idle/walk frame 1
- **tile_0001.png** - Green character walk frame 2

These are used for the player character with walking animation.

### Platform Tiles
**Location**: `kenney_pixel-platformer/Tiles/`

- **tile_0000.png** - Grass top tile (green/teal platform surface)
- **tile_0048.png** - Dirt middle tile (brown/orange dirt)
- **tile_0049.png** - Stone middle tile (brown stone platform)

Used for creating platforms and ground surfaces.

### Collectibles
**Location**: `kenney_pixel-platformer/Tiles/`

- **tile_0038.png** - Coin sprite (golden collectible)

Used for collectible coins with bounce animation.

### Decorations
**Location**: `kenney_pixel-platformer/Tiles/`

- **tile_0096.png** - Tree sprite (green tree decoration)
- **tile_0097.png** - Bush sprite (green bush decoration)

Used for environmental decoration on the ground level.

### Background Elements
**Location**: `kenney_pixel-platformer/Tiles/Backgrounds/`

- **tile_0008.png** - Cloud sprite (white/light blue cloud)

Used for animated scrolling clouds in the background.

## Sprite Loading System

The game uses a dynamic sprite loading system that:

1. Loads each sprite as an individual Image object
2. Tracks loading progress with `gameState.assetsLoaded`
3. Starts the game loop only after all assets are loaded
4. Renders sprites using `ctx.drawImage()` with proper scaling

## Asset Organization

```
kenney_pixel-platformer/
├── Tiles/
│   ├── Characters/
│   │   ├── tile_0000.png (Player idle/walk 1)
│   │   └── tile_0001.png (Player walk 2)
│   ├── Backgrounds/
│   │   └── tile_0008.png (Cloud)
│   ├── tile_0000.png (Grass platform)
│   ├── tile_0038.png (Coin)
│   ├── tile_0048.png (Dirt)
│   ├── tile_0049.png (Stone)
│   ├── tile_0096.png (Tree)
│   └── tile_0097.png (Bush)
└── Tilemap/ (Not used in current implementation)
```

## Future Sprite Additions

Additional sprites available in the asset pack that could be added:

- **Enemies**: Characters tiles 0002-0026 (various enemy sprites)
- **Items**: Tiles 0064-0095 (spikes, springs, signs, etc.)
- **Platform Variations**: Tiles 0001-0047 (different platform types)
- **Background Decorations**: Background tiles 0009-0023 (mountains, hills)

## Animation Details

### Player Animation
- **Idle**: tile_0000.png (static)
- **Walking**: Alternates between tile_0000.png and tile_0001.png every 8 frames
- **Direction**: Sprite flips horizontally based on movement direction

### Coin Animation
- **Bounce Effect**: Sine wave vertical movement
- **Speed**: Oscillates at 200ms intervals

### Cloud Animation
- **Scrolling**: Moves left at 50ms per pixel
- **Wrapping**: Clouds wrap around when they exit the screen
