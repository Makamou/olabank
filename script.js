'use strict';

/* =========================
   OLABANK – AUTO LOGOUT
   ========================= */

/////////////////////////////////////////////////
// DATA
const account1 = {
  owner: 'Moubarak Akamou',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1234,
};

const account2 = {
  owner: 'Malik Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Sanchez',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Daniel Johnson',
  movements: [1200, -300, 450, -150, 900, -50],
  interestRate: 1.3,
  pin: 5555,
};
const account6 = {
  owner: 'Aisha Mohamed',
  movements: [300, 600, -100, -250, 1200, 400],
  interestRate: 1.1,
  pin: 6666,
};

const account7 = {
  owner: 'Carlos Mendoza',
  movements: [2500, -500, -200, 850, -300, 120],
  interestRate: 1.4,
  pin: 7777,
};

const account8 = {
  owner: 'Emily Carter',
  movements: [800, -100, 200, -50, 400, 950],
  interestRate: 0.9,
  pin: 8888,
};

const account9 = {
  owner: 'Hassan Ali',
  movements: [1500, -700, 300, -100, 50, 900],
  interestRate: 1.6,
  pin: 9999,
};

const account10 = {
  owner: 'Olivia Brown',
  movements: [400, 1200, -350, -100, 600, 200],
  interestRate: 1.0,
  pin: 1010,
};

/* ✅ UPDATED ACCOUNTS ARRAY */
const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
  account8,
  account9,
  account10,
];

/////////////////////////////////////////////////
// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelDate = document.querySelector('.date');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// INITIAL STATE
containerApp.style.opacity = 0;
containerApp.style.pointerEvents = 'none';

/////////////////////////////////////////////////
// FUNCTIONS
const displayCurrentDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const year = now.getFullYear();

  labelDate.textContent = `${day}/${month}/${year}`;
};

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__value">${mov}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = acc => {
  const income = acc.movements.filter(m => m > 0).reduce((a, b) => a + b, 0);
  const out = acc.movements.filter(m => m < 0).reduce((a, b) => a + b, 0);
  const interest = acc.movements
    .filter(m => m > 0)
    .map(d => (d * acc.interestRate) / 100)
    .reduce((a, b) => a + b, 0);

  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = acc => {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');
  });
};
createUsernames(accounts);

/////////////////////////////////////////////////
// AUTO LOGOUT TIMER

let logoutTimer;

const startLogoutTimer = () => {
  let time = 300; // 5 minutes (300s)

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(logoutTimer);

      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      containerApp.style.pointerEvents = 'none';
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////////////////////////////////
// EVENTS

let currentAccount;
let sorted = false;

// LOGIN
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 1;
    containerApp.style.pointerEvents = 'auto';

    // ✅ SHOW CURRENT DATE
    displayCurrentDate();

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (logoutTimer) clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();

    updateUI(currentAccount);
  }
});

// TRANSFER
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();

    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    clearInterval(logoutTimer);

    containerApp.style.opacity = 0;
    containerApp.style.pointerEvents = 'none';
    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;

  clearInterval(logoutTimer);
  logoutTimer = startLogoutTimer();
});
