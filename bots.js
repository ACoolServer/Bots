const mineflayer = require('mineflayer');

const SERVER_HOST = 'ACoolServerEG.aternos.me'; // your Aternos address
const SERVER_PORT = 25565;

const botNames = ['John', 'Gibvgh'];

function createBot(name) {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: name,
    version: '1.21.11' // change to your server version
  });

  bot.once('spawn', () => {
    console.log(`${name} spawned!`);
    startRandomMovement(bot);

    // Only RandomBot1 sends anti-AFK chat
    if (name === 'RandomBot1') {
      startAntiAFK(bot);
    }
  });

  // Auto reconnect if disconnected
  bot.on('end', () => {
    console.log(`${name} disconnected, reconnecting in 5s...`);
    setTimeout(() => createBot(name), 5000);
  });

  bot.on('error', err => {
    console.log(`${name} error:`, err.message);
  });

  bot.on('kicked', reason => {
    console.log(`${name} kicked:`, reason);
    setTimeout(() => createBot(name), 5000);
  });
}

function startRandomMovement(bot) {
  const controls = ['forward', 'back', 'left', 'right'];

  setInterval(() => {
    controls.forEach(c => bot.setControlState(c, false));

    const randomDir = controls[Math.floor(Math.random() * controls.length)];
    bot.setControlState(randomDir, true);

    // Occasionally jump
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }

    bot.entity.yaw = Math.random() * Math.PI * 2;

  }, 1500);
}

function startAntiAFK(bot) {
  // Swing arm every 30 seconds to stay "active"
  setInterval(() => {
    bot.swingArm();
    console.log('Anti-AFK triggered!');
  }, 30000);

  // Send a chat message every 10 minutes to prevent shutdown
  setInterval(() => {
    bot.chat('.');
    console.log('Anti-shutdown chat sent!');
  }, 600000);

  // Crouch and uncrouch every 2 minutes
  setInterval(() => {
    bot.setControlState('sneak', true);
    setTimeout(() => bot.setControlState('sneak', false), 2000);
  }, 120000);
}

// Spawn both bots with delay
botNames.forEach((name, i) => {
  setTimeout(() => createBot(name), i * 3000);
});
