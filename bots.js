const mineflayer = require('mineflayer');

const SERVER_HOST = 'ACoolServerEG.aternos.me'; // your server IP
const SERVER_PORT = 25565;       // your server port

const botNames = ['AhmedLoL', 'AliLoL'];

function createBot(name) {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: name,
    version: '1.20.1' // change to your server version
  });

  bot.once('spawn', () => {
    console.log(`${name} spawned!`);
    startRandomMovement(bot);
  });

  bot.on('error', err => console.log(`${name} error:`, err));
  bot.on('kicked', reason => console.log(`${name} kicked:`, reason));
}

function startRandomMovement(bot) {
  setInterval(() => {
    const controls = ['forward', 'back', 'left', 'right'];

    // Stop all movement first
    controls.forEach(c => bot.setControlState(c, false));

    // Pick a random direction
    const randomDir = controls[Math.floor(Math.random() * controls.length)];
    bot.setControlState(randomDir, true);

    // Occasionally jump
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }

    // Random yaw (look direction)
    bot.entity.yaw = Math.random() * Math.PI * 2;

  }, 1500); // change direction every 1.5 seconds
}

// Spawn both bots with a slight delay
botNames.forEach((name, i) => {
  setTimeout(() => createBot(name), i * 3000);
});
