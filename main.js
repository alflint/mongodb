const { start_mongo } = require('./db/setup');
const { start_express } = require('./api/server');

async function main() {
  try {
    await start_mongo();
    start_express();
  } catch (err) {
    console.error(err);
  }
}

main();
