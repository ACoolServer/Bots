const mineflayer = require('mineflayer');

const SERVER_HOST = 'ACoolServerEG.aternos.me';
const SERVER_PORT = 25565;

function createBot(name, reconnectInterval) {
  let bot;
  let movementInterval;
  let reconnectTimer;

  function cleanup() {
    if (movementInterval) clearInterval(movementInterval);
    if (reconnectTimer) clearTimeout(reconnectTimer);
    movementInterval = null;
    reconnectTimer = null;
  }

  function connect() {
    cleanup();

    bot = mineflayer.createBot({
      host: SERVER_HOST,
      port: SERVER_PORT,
      username: name,
      version: '1.21.11',
      hideErrors: true,
      checkTimeoutInterval: 30000
    });

    bot.once('spawn', () => {
      startRandomMovement();
      if (name === 'John') startAntiAFK();

      // Schedule disconnect
      reconnectTimer = setTimeout(() => {
        cleanup();
        try { bot.quit(); } catch(e) {}
        setTimeout(connect, 5000);
      }, reconnectInterval);
    });

    bot.on('death', () => {
      try { bot.respawn(); } catch(e) {}
    });

    bot.on('error', () => {
      cleanup();
      setTimeout(connect, 10000);
    });

    bot.on('kicked', () => {
      cleanup();
      setTimeout(connect, 10000);
    });

    bot.on('end', () => {
      cleanup();
    });
  }

  function startRandomMovement() {
    const controls = ['forward', 'back', 'left', 'right'];

    movementInterval = setInterval(() => {
      if (!bot || !bot.entity) return; // safety check

      controls.forEach(c => bot.setControlState(c, false));
      const randomDir = controls[Math.floor(Math.random() * controls.length)];
      bot.setControlState(randomDir, true);

      if (Math.random() < 0.3) {
        bot.setControlState('jump', true);
        setTimeout(() => {
          try { bot.setControlState('jump', false); } catch(e) {}
        }, 500);
      }

    }, 2000); // slower = less RAM
  }

  function startAntiAFK() {
    setInterval(() => {
      try { bot.swingArm(); } catch(e) {}
    }, 60000); // every 1 min

    setInterval(() => {
      try { bot.chat('.'); } catch(e) {}
    }, 600000);
  }

  connect();
}

createBot('John', 10 * 60 * 1000);
setTimeout(() => createBot('Messi', 5 * 60 * 1000), 5000);
