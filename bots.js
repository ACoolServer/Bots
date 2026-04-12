const mineflayer = require('mineflayer');

const SERVER_HOST = 'ACoolServerEG.aternos.me';
const SERVER_PORT = 25565;

setInterval(() => {
  console.clear();
  if (global.gc) global.gc();
}, 30000);

function createBot(name, reconnectInterval) {
  let bot;

  function connect() {
    bot = mineflayer.createBot({
      host: SERVER_HOST,
      port: SERVER_PORT,
      username: name,
      version: '1.20.1',
      hideErrors: true
    });

    bot.once('spawn', () => {
      startRandomMovement(bot);
      if (name === 'John') startAntiAFK(bot);
    });

    bot.on('death', () => { bot.respawn(); });
    bot.on('health', () => { if (bot.health <= 0) bot.respawn(); });
    bot.on('error', () => {});
    bot.on('kicked', () => { setTimeout(connect, 5000); });
    bot.on('end', () => {});

    setTimeout(() => {
      bot.quit();
      setTimeout(connect, 3000);
    }, reconnectInterval);
  }

  connect();
}

function startRandomMovement(bot) {
  const controls = ['forward', 'back', 'left', 'right'];

  setInterval(() => {
    controls.forEach(c => bot.setControlState(c, false));
    const randomDir = controls[Math.floor(Math.random() * controls.length)];
    bot.setControlState(randomDir, true);

    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }

    bot.entity.yaw = Math.random() * Math.PI * 2;
  }, 1500);
}

function startAntiAFK(bot) {
  setInterval(() => { bot.swingArm(); }, 30000);
  setInterval(() => { bot.chat('.'); }, 600000);
  setInterval(() => {
    bot.setControlState('sneak', true);
    setTimeout(() => bot.setControlState('sneak', false), 2000);
  }, 120000);
}

createBot('John', 10 * 60 * 1000);
setTimeout(() => createBot('Messi', 5 * 60 * 1000), 3000);
