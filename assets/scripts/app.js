const ATTACK_VALUE = 6;
const STRONG_ATTACK_VALUE = 14;
const MONSTER_ATTACK_VALUE = 10;
const HEAL_VALUE = 20;

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function endRound() {
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won the Game!');
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost the Game!');
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You hava a draw!!');
  }
}

function monsterAttack(mode) {
  let maxDamage;
  if (mode === 'ATTACK') {
    maxDamage = ATTACK_VALUE;
  } else if (mode === 'STRONG_ATTACK') {
    maxDamage = STRONG_ATTACK_VALUE;
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  endRound();
}

function attackHandler() {
  monsterAttack('ATTACK');
}

function strongAttackHandler() {
  monsterAttack('STRONG_ATTACK');
}

function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){ //100 >= 100 - 20 (80)-> true
        alert(`You can't heal to more than your max initial health.`)
        healValue = chosenMaxLife - currentPlayerHealth;
    }else {
        healValue = HEAL_VALUE;
    }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += healValue;
  endRound();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
