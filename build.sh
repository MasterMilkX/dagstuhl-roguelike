cat utils.js > dump.js
cat entities.js >> dump.js
cat pcg.js >> dump.js
cat ui.js >> dump.js
cat llama.js >> dump.js
cat main.js >> dump.js
rollup dump.js --file bundled_game.js --format iife