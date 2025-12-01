'use strict';

/* OLABANK */

/////////////////////////////////////////////////////////////////////
// Customer Data
const account1 = {
  owner: 'Moubarak Akamou',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
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
  owner: 'Michael Thompson',
  movements: [200, -100, 340, -300, 50, 400],
  interestRate: 1.2,
  pin: 5555,
};

const account6 = {
  owner: 'Emily Carter',
  movements: [500, 1200, -300, 50, -100, 200],
  interestRate: 1.3,
  pin: 6666,
};

const account7 = {
  owner: 'Daniel Rodriguez',
  movements: [150, -50, 600, -200, 1000],
  interestRate: 1.1,
  pin: 7777,
};

const account8 = {
  owner: 'Olivia Brown',
  movements: [900, 200, -150, 350, -50],
  interestRate: 1.4,
  pin: 8888,
};

const account9 = {
  owner: 'William Harris',
  movements: [-200, 450, 1200, -100, 300],
  interestRate: 1.2,
  pin: 9999,
};

const account10 = {
  owner: 'Sophia Wilson',
  movements: [300, 500, -200, 1000, -100, 50],
  interestRate: 1.5,
  pin: 1010,
};

const account11 = {
  owner: 'David Anderson',
  movements: [400, -100, 700, 200, -50],
  interestRate: 1,
  pin: 1111,
};

const account12 = {
  owner: 'Ava Martinez',
  movements: [250, 800, -300, -50, 600],
  interestRate: 1.3,
  pin: 1212,
};

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
  account11,
  account12,
];
/////////////////////////////////////////////////////////////////////

// Elements select
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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

//
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //.textContent = 0 Another way to write to the html page

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acct => {
  acct.balance = acct.movements.reduce((acc, amount) => acc + amount, 0);
  // acct.balance = balance;
  labelBalance.innerHTML = `${acct.balance}€`; //add balance to the page
};

const calcDisplaySummary = account => {
  const income = account.movements
    .filter(deposit => deposit > 0)
    .reduce((acc, currV) => acc + currV, 0);
  const outcome = account.movements
    .filter(withdraw => withdraw < 0)
    .reduce((acc, currV) => acc + currV, 0);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.innerHTML = `${income}€`;
  labelSumOut.innerHTML = `${Math.abs(outcome)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .split(' ')
      .map(word => word[0])
      .join('')
      .toLowerCase();
  });
};
createUserNames(accounts);

const updateUI = acct => {
  //Display movement
  displayMovements(acct.movements);
  // Display balance
  calcDisplayBalance(acct);
  //Display summary
  calcDisplaySummary(acct);
};

//Login parameter
let userAcct = 0;
btnLogin.addEventListener('click', e => {
  e.preventDefault(); //the page will not reload
  userAcct = accounts.find(acct => acct.username === inputLoginUsername.value);

  if (userAcct?.pin === Number(inputLoginPin.value)) {
    //Display UI and wlcome message
    labelWelcome.innerHTML = `Welcome back, ${userAcct.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100; //set a style

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(userAcct);
  }
});

// transfer setting
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    userAcct.balance >= amount &&
    receiverAcc?.username !== userAcct.username
  ) {
    userAcct.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(userAcct);
  }
});

//setting for the loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && userAcct.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    userAcct.movements.push(amount);

    updateUI(userAcct);
  }
  inputLoanAmount.value = '';
});

//close account setting
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === userAcct.username &&
    userAcct.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acct => acct.username === userAcct.username
    );
    console.log(index);

    //delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  // labelWelcome.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(userAcct.movements, !sorted);
  sorted = !sorted;
});
