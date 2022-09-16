"use strict";
//ALL_STATIC_VALUES
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MAX_LIFE = 200;
const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; //MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
const TARGET_ATTACK_MONSTER = 'MONSTER';
const TARGET_ATTACK_PLAYER = 'PLAYER';

let battleLog = [];
let chosenMaxLife;

function getMaxLifeValues() {
  const enteredValue = prompt(
    'Maximum life for you and the monster.',
    MAX_LIFE
  );

  const parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= MAX_LIFE - 1) {
    throw { message: 'Invalid user input, not a valid number!' };
  }
  return parsedValue;
}

try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife = MAX_LIFE;
  alert('You entered something wrong!! default value of 200 was used.');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  //if else if
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = TARGET_ATTACK_MONSTER;
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = TARGET_ATTACK_MONSTER;
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = TARGET_ATTACK_PLAYER;
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = TARGET_ATTACK_PLAYER;
  }

  // switch case
  // switch (event) {
  //   case LOG_EVENT_PLAYER_ATTACK:
  //     logEntry.target = TARGET_ATTACK_MONSTER;
  //     break;
  //   case LOG_EVENT_PLAYER_STRONG_ATTACK:
  //     logEntry.target = TARGET_ATTACK_MONSTER;
  //     break;
  //   case LOG_EVENT_MONSTER_ATTACK:
  //     logEntry.target = TARGET_ATTACK_PLAYER;
  //     break;
  //   case LOG_EVENT_PLAYER_HEAL:
  //     logEntry.target = TARGET_ATTACK_PLAYER;
  //     break;
  //   default:
  //     logEntry = {};
  // }

  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead but the bonus life saved you!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won the Game!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'YOU WON!!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost the Game!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'YOU LOST!!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You hava a draw!!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'YOU HAVE A DRAW!!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function monsterAttack(mode) {
  //ternary operator
  //condition ? if block : else block;
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK; //ternary operator
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  monsterAttack(MODE_ATTACK);
}

function strongAttackHandler() {
  if (currentPlayerHealth <= currentMonsterHealth) {
    monsterAttack(MODE_STRONG_ATTACK);
  } else {
    alert('Your current health above monster health. Use "ATTACK"');
  }
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    //100 >= 100 - 20 (80)-> true
    alert(`You can't heal to more than your max initial health.`);
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  // for (let i = 0; i < battleLog.length; i++){
  //   console.log(battleLog[i]);
  // }
  // console.log(battleLog);

  let i = 0;
  for (const logEntry of battleLog) {
    console.log(`#${i}`);
    for (const key in logEntry) {
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
