const { start_mongo } = require('./db/setup');

async function main() {
  try {
    await start_mongo();
  } catch (err) {
    console.error(err);
  }
}

main();
