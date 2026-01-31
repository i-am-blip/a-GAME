// Game Configuration
const SCALE = 2;

const CONFIG = {
    player: {
        width: 24,
        height: 24,
        x: 100,
        moveSpeed: 4,
        jumpForce: 13,
        gravity: 0.6,
        maxFallSpeed: 12
    },
    tile: {
        size: 18
    },
    scroll: {
        baseSpeed: 0,
        speedIncrease: 0,
        maxSpeed: 0
    },
    platform: {
        minGap: 50,
        maxGap: 100,
        minWidth: 100,
        maxWidth: 250,
        height: 18,
        startY: 150
    }
};

// Game State
const gameState = {
    score: 0,
    bestScore: localStorage.getItem('bestScore') || 0,
    isGameOver: false,
    isPlaying: false,
    assetsLoaded: 0,
    totalAssets: 0,
    cameraX: 0,
    logicalWidth: 0,
    logicalHeight: 0,
    keys: { left: false, right: false, up: false }
};

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameState.logicalWidth = Math.ceil(canvas.width / SCALE);
    gameState.logicalHeight = Math.ceil(canvas.height / SCALE);
    ctx.imageSmoothingEnabled = false;
    ctx.scale(SCALE, SCALE);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Sprite Assets
const sprites = {
    player: { idle: null, walk: [] },
    platforms: { grassLeft: null, grassMid: null, grassRight: null, dirt: null, water: null },
    coin: null,
    decorations: { tree: null, bush: null, crate: null, fence: null },
    enemies: { red: null },
    background: { clouds: [], mountains: [], seamless: null }
};

// Entities
const player = {
    x: CONFIG.player.x,
    y: 100,
    width: CONFIG.player.width,
    height: CONFIG.player.height,
    velocityX: 0,
    velocityY: 0,
    isOnGround: false,
    isJumping: false,
    facingRight: true,
    spriteIndex: 0,
    animationFrame: 0
};

const platforms = [];
const coins = [];
const decorations = [];
const enemies = [];
const clouds = [];
const mountains = [];

// Initialization
function initializeGame() {
    platforms.push({
        x: -200,
        y: gameState.logicalHeight - 100,
        width: gameState.logicalWidth + 400,
        height: 100,
        visualHeight: 100,
        type: 'ground'
    });

    for (let i = 0; i < 6; i++) {
        clouds.push({
            x: Math.random() * gameState.logicalWidth * 2,
            y: Math.random() * (gameState.logicalHeight * 0.5),
            speed: 0.1,
            type: Math.floor(Math.random() * 2)
        });
    }
}

function generateChunk(lastX) {
    const gap = CONFIG.platform.minGap + Math.random() * (CONFIG.platform.maxGap - CONFIG.platform.minGap);
    const width = CONFIG.platform.minWidth + Math.random() * (CONFIG.platform.maxWidth - CONFIG.platform.minWidth);
    const snappedWidth = Math.ceil(width / CONFIG.tile.size) * CONFIG.tile.size;

    const minY = gameState.logicalHeight * 0.4;
    const maxY = gameState.logicalHeight * 0.75;
    const y = minY + Math.random() * (maxY - minY);
    const chunkDepth = 126;

    const newX = lastX + gap;

    platforms.push({
        x: newX,
        y: y,
        width: snappedWidth,
        height: 18,
        visualHeight: chunkDepth,
        type: 'platform'
    });

    if (Math.random() > 0.4) {
        coins.push({ x: newX + snappedWidth / 2, y: y - 40, collected: false });
    }
    if (snappedWidth > 80 && Math.random() > 0.6) decorations.push({ type: 'tree', x: newX + snappedWidth / 2, y: y - 18 });
    else if (Math.random() > 0.5) decorations.push({ type: 'bush', x: newX + Math.random() * (snappedWidth - 20), y: y - 18 });

    if (snappedWidth > 120 && Math.random() > 0.7) {
        enemies.push({
            x: newX + snappedWidth - 40,
            y: y - 24,
            width: 24, height: 24,
            patrolStart: newX,
            patrolEnd: newX + snappedWidth,
            speed: -0.5,
            type: 'red'
        });
    }
    return newX + snappedWidth;
}

function loadSprites() {
    const p = 'kenney_pixel-platformer/Assets/';
    const paths = {
        idle: p + 'Characters/tile_0000.png',
        walk1: p + 'Characters/tile_0000.png',
        walk2: p + 'Characters/tile_0001.png',
        grassLeft: p + 'Tiles/tile_0000.png',
        grassMid: p + 'Tiles/tile_0001.png',
        grassRight: p + 'Tiles/tile_0002.png',
        dirt: p + 'Tiles/tile_0004.png',
        water: p + 'Tiles/tile_0144.png',
        coin: p + 'Tiles/tile_0038.png',
        tree: p + 'Tiles/tile_0096.png',
        bush: p + 'Tiles/tile_0097.png',
        crate: p + 'Tiles/tile_0011.png',
        enemy: p + 'Characters/tile_0015.png',
        c1: p + 'Backgrounds/tile_0008.png',
        c2: p + 'Backgrounds/tile_0009.png',
        m1: p + 'Backgrounds/tile_0012.png',
        m2: p + 'Backgrounds/tile_0013.png',
        // Loading the PACKED sheet again, but we will crop it this time
        seamless: p + 'Tilemap/tilemap-backgrounds_packed.png'
    };

    gameState.totalAssets = Object.keys(paths).length;
    const load = (src) => { const img = new Image(); img.src = src; img.onload = checkAssetsLoaded; return img; };

    sprites.player.idle = load(paths.idle);
    sprites.player.walk = [load(paths.walk1), load(paths.walk2)];
    sprites.platforms.grassLeft = load(paths.grassLeft);
    sprites.platforms.grassMid = load(paths.grassMid);
    sprites.platforms.grassRight = load(paths.grassRight);
    sprites.platforms.dirt = load(paths.dirt);
    sprites.platforms.water = load(paths.water);
    sprites.coin = load(paths.coin);
    sprites.decorations.tree = load(paths.tree);
    sprites.decorations.bush = load(paths.bush);
    sprites.decorations.crate = load(paths.crate);
    sprites.enemies.red = load(paths.enemy);
    sprites.background.clouds = [load(paths.c1), load(paths.c2)];
    sprites.background.mountains = [load(paths.m1), load(paths.m2)];
    sprites.background.seamless = load(paths.seamless);
}

function checkAssetsLoaded() {
    gameState.assetsLoaded++;
    if (gameState.assetsLoaded >= gameState.totalAssets) {
        initializeGame();
        player.y = gameState.logicalHeight - 100 - player.height;
        player.isOnGround = true;
        gameLoop();
    }
}

function handleKey(e, isDown) {
    if (gameState.isGameOver) return;
    if (isDown && e.code === 'Space' && !gameState.isPlaying) gameState.isPlaying = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') gameState.keys.right = isDown;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') gameState.keys.left = isDown;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') gameState.keys.up = isDown;
}

document.addEventListener('keydown', e => handleKey(e, true));
document.addEventListener('keyup', e => handleKey(e, false));
document.getElementById('restartBtn').addEventListener('click', resetGame);

function updatePlayer() {
    if (!gameState.isPlaying) return;

    if (gameState.keys.right) {
        player.velocityX = CONFIG.player.moveSpeed;
        player.facingRight = true;
    } else if (gameState.keys.left) {
        player.velocityX = -CONFIG.player.moveSpeed;
        player.facingRight = false;
    } else {
        player.velocityX = 0;
    }

    player.x += player.velocityX;

    if (gameState.keys.up && player.isOnGround) {
        player.velocityY = -CONFIG.player.jumpForce;
        player.isOnGround = false;
        player.isJumping = true;
    }

    player.velocityY += CONFIG.player.gravity;
    if (player.velocityY > CONFIG.player.maxFallSpeed) player.velocityY = CONFIG.player.maxFallSpeed;
    player.y += player.velocityY;

    if (Math.abs(player.velocityX) > 0 && player.isOnGround) {
        player.animationFrame++;
        if (player.animationFrame > 6) {
            player.spriteIndex = (player.spriteIndex + 1) % 2;
            player.animationFrame = 0;
        }
    } else {
        player.spriteIndex = player.isOnGround ? 0 : 1;
    }

    if (player.y > gameState.logicalHeight + 50) gameOver();
}

function updateWorld() {
    if (!gameState.isPlaying) return;

    const targetCamX = player.x - gameState.logicalWidth / 3;
    gameState.cameraX = Math.max(0, targetCamX);

    const dist = Math.floor(player.x / 10);
    if (dist > gameState.score) gameState.score = dist;

    const last = platforms[platforms.length - 1];
    if (last && last.x < gameState.cameraX + gameState.logicalWidth + 300) generateChunk(last.x + last.width);

    const cleanup = (arr) => {
        for (let i = arr.length - 1; i >= 0; i--) {
            const endX = arr[i].width ? arr[i].x + arr[i].width : arr[i].x;
            if (endX < gameState.cameraX - 500) arr.splice(i, 1);
        }
    };
    cleanup(platforms); cleanup(coins); cleanup(decorations); cleanup(enemies);

    clouds.forEach(c => {
        c.x -= c.speed;
        if (c.x < gameState.cameraX - 100) c.x = gameState.cameraX + gameState.logicalWidth + 100;
    });

    enemies.forEach(e => {
        e.x += e.speed;
        if (e.x < e.patrolStart || e.x > e.patrolEnd - e.width) e.speed *= -1;
    });
}

function checkCollisions() {
    if (!gameState.isPlaying) return;
    player.isOnGround = false;
    platforms.forEach(p => {
        if (player.x < p.x + p.width && player.x + player.width > p.x &&
            player.y < p.y + p.height && player.y + player.height > p.y) {

            const oL = (player.x + player.width) - p.x;
            const oR = (p.x + p.width) - player.x;
            const oT = (player.y + player.height) - p.y;
            const oB = (p.y + p.height) - player.y;
            const min = Math.min(oL, oR, oT, oB);

            if (min === oT && player.velocityY > 0) {
                player.y = p.y - player.height;
                player.velocityY = 0;
                player.isOnGround = true;
                player.isJumping = false;
            } else if (min === oB && player.velocityY < 0) {
                player.y = p.y + p.height;
                player.velocityY = 0;
            } else if (min === oL || min === oR) {
                if (min === oL) player.x = p.x - player.width;
                else player.x = p.x + p.width;
            }
        }
    });

    enemies.forEach(e => {
        if (player.x < e.x + e.width && player.x + player.width > e.x &&
            player.y < e.y + e.height && player.y + player.height > e.y) gameOver();
    });
}

function checkItems() {
    if (!gameState.isPlaying) return;
    coins.forEach(c => {
        if (c.collected) return;
        if (Math.hypot((player.x + player.width / 2) - c.x, (player.y + player.height / 2) - c.y) < 20) {
            c.collected = true; gameState.score += 50;
        }
    });
}

function draw() {
    // 1. Sky Color (Base)
    ctx.fillStyle = '#cbf0ff';
    ctx.fillRect(0, 0, gameState.logicalWidth, gameState.logicalHeight);

    // 2. Seamless Background - CROPPED BLUE TILE
    const visualScale = 2;
    if (sprites.background.seamless && sprites.background.seamless.width > 0) {
        const bg = sprites.background.seamless;

        const tileW = 24;
        const w = tileW * visualScale;
        const h = tileW * visualScale;

        // Tile it
        for (let x = 0; x < gameState.logicalWidth; x += w) {
            for (let y = 0; y < gameState.logicalHeight; y += h) {
                // Source: 0, 0, 24, 24 (Blue tile)
                ctx.drawImage(bg, 0, 0, 24, 24, x, y, w, h);
            }
        }
    }

    // 2b. Add Horizon Cloud Strip
    if (sprites.background.clouds[0]) {
        const cImg = sprites.background.clouds[0];
        const cW = 24 * visualScale;
        const cH = 24 * visualScale;
        const cY = gameState.logicalHeight - cH - 50;

        const ticks = gameState.cameraX * 0.1;
        const offset = ticks % cW;

        for (let x = -offset; x < gameState.logicalWidth; x += cW) {
            ctx.drawImage(cImg, 0, 0, 24, 24, x, cY, cW, cH);
        }
    }

    // 3. Floating Clouds (Foreground depth)
    clouds.forEach(c => {
        ctx.drawImage(sprites.background.clouds[c.type], c.x - (gameState.cameraX * 0.5), c.y, 32, 18);
    });

    if (sprites.platforms.grassMid) {
        platforms.forEach(p => {
            const sx = p.x - gameState.cameraX;
            if (sx + p.width > -50 && sx < gameState.logicalWidth + 50) {
                const w = CONFIG.tile.size;
                const cols = Math.ceil(p.width / w);
                const rows = Math.ceil(p.visualHeight / w);

                for (let i = 0; i < cols; i++) {
                    const tx = sx + i * w;
                    // Aggressive cropping logic (retained)
                    const cropS = 2; const cropT = 1; const cropB = 2;
                    let img, srcX = 0, srcY = cropT, srcW, srcH = 18 - cropT - cropB;

                    if (i === 0) {
                        img = sprites.platforms.grassLeft; srcW = 18 - cropS; srcX = 0;
                        ctx.drawImage(img, srcX, srcY, srcW, srcH, tx, p.y, w, w);
                    } else if (i === cols - 1) {
                        img = sprites.platforms.grassRight; srcW = 18 - cropS; srcX = cropS;
                        ctx.drawImage(img, srcX, srcY, srcW, srcH, tx, p.y, w, w);
                    } else {
                        img = sprites.platforms.grassMid; srcW = 18 - cropS * 2; srcX = cropS;
                        ctx.drawImage(img, srcX, srcY, srcW, srcH, tx, p.y, w, w);
                    }

                    for (let j = 1; j < rows; j++) {
                        const dy = p.y + j * w;
                        const seed = Math.abs((Math.floor(p.x) + i * 397 + j * 123) % 4);
                        ctx.save(); ctx.translate(tx + w / 2, dy + w / 2); ctx.rotate(seed * Math.PI / 2);
                        ctx.drawImage(sprites.platforms.dirt, 2, 2, 14, 14, -w / 2, -w / 2, w, w);
                        ctx.restore();
                    }
                }
            }
        });
    }

    decorations.forEach(d => {
        const sx = d.x - gameState.cameraX;
        if (sx > -50 && sx < gameState.logicalWidth + 50) ctx.drawImage(sprites.decorations[d.type], sx, d.y, 18, 18);
    });

    enemies.forEach(e => {
        const sx = e.x - gameState.cameraX;
        if (sx > -50 && sx < gameState.logicalWidth + 50) {
            ctx.save();
            if (e.speed > 0) { ctx.translate(sx + e.width, e.y); ctx.scale(-1, 1); ctx.drawImage(sprites.enemies[e.type], 0, 0, e.width, e.height); }
            else ctx.drawImage(sprites.enemies[e.type], sx, e.y, e.width, e.height);
            ctx.restore();
        }
    });

    if (sprites.coin) coins.forEach(c => {
        if (!c.collected && c.x - gameState.cameraX > -20 && c.x - gameState.cameraX < gameState.logicalWidth + 20) {
            const b = Math.sin(Date.now() / 200) * 3;
            ctx.drawImage(sprites.coin, c.x - gameState.cameraX - 9, c.y - 9 + b, 18, 18);
        }
    });

    if (sprites.player.idle) {
        if (!gameState.isPlaying) {
            ctx.drawImage(sprites.player.idle, player.x - gameState.cameraX, player.y, player.width, player.height);
            ctx.fillStyle = "white"; ctx.font = "16px 'Press Start 2P', sans-serif";
            ctx.textAlign = "center"; ctx.shadowColor = "black"; ctx.shadowBlur = 2;
            ctx.fillText("PRESS SPACE TO START", gameState.logicalWidth / 2, gameState.logicalHeight / 2 - 50); ctx.shadowBlur = 0;
        } else {
            ctx.save();
            if (player.facingRight) {
                ctx.translate((player.x - gameState.cameraX) + player.width, player.y);
                ctx.scale(-1, 1);
                ctx.drawImage(sprites.player.walk[player.spriteIndex], 0, 0, player.width, player.height);
            } else {
                ctx.drawImage(sprites.player.walk[player.spriteIndex], player.x - gameState.cameraX, player.y, player.width, player.height);
            }
            ctx.restore();
        }
    }
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('speed').textContent = "MANUAL";
}

function gameOver() {
    if (gameState.isGameOver) return;
    gameState.isGameOver = true; gameState.isPlaying = false;
    if (gameState.score > gameState.bestScore) localStorage.setItem('bestScore', gameState.score);
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('bestScore').textContent = gameState.bestScore;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function resetGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    gameState.score = 0; gameState.isGameOver = false; gameState.isPlaying = false;
    gameState.cameraX = 0;
    gameState.keys = { left: false, right: false, up: false };
    platforms.length = 0; coins.length = 0; decorations.length = 0; enemies.length = 0;
    initializeGame();
    player.x = CONFIG.player.x;
    player.y = gameState.logicalHeight - 100 - player.height;
    player.velocityX = 0; player.velocityY = 0; player.isOnGround = true;
    updateUI();
}

function gameLoop() {
    if (!gameState.isGameOver) {
        updatePlayer(); updateWorld(); checkCollisions(); checkItems(); updateUI();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

loadSprites();
