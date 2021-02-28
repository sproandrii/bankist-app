'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-02-23T14:11:59.604Z',
    '2021-02-27T17:01:17.194Z',
    '2021-02-28T23:36:17.929Z',
    '2021-02-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
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

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formatedMov = formatCur(mov, acc.locale, acc.currency);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatedMov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acu, mov) => acu + mov);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acu, mov) => acu + mov);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(dep => dep >= 1)
    .reduce((acu, int) => acu + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount;

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
  console.log(receiverAcc);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
  }
  updateUI(currentAccount);

  // Clear input field
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('start');
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    console.log('Deleted');

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, 0, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2, -1));
// console.log(arr.splice(2, 0, 'three'));
// console.log(arr);
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
// const concated = [...arr, ...arr2];
// console.log(concated);
// const concated2 = arr2.reverse().concat(arr.reverse());
// console.log(concated2);
// console.log(concated2.join(' ^ '));
// console.log(concated2);

// for (const movement of movements) {
//   if (movement > 0) console.log(`You depposited ${movement}`);
//   else console.log(`You withdrew ${Math.abs(movement)}`);
// }
// console.log('-----forEach------');
// movements.forEach(function (mov, i, arr) {
//   if (mov >= 200) console.log(`${i + 1}: You depposited ${mov}`);
//   else console.log(`${i + 1}: You withdrew ${Math.abs(mov)}`);
// });

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = (dogsJulia, dogsKate) => {
//   const correctJulia = dogsJulia.slice(1, -2);
//   const allDogs = [...correctJulia, ...dogsKate];
//   allDogs.forEach(function (dog, i) {
//     const str =
//       dog <= 3
//         ? `Dog number ${i + 1} is still a puppy 🐶`
//         : `Dog number ${i + 1} is an adult, and is ${dog} years old`;
//     console.log(str);
//   });
//   console.log(allDogs);
// };
// checkDogs(dogsJulia, dogsKate);
// console.log(dogsJulia, dogsKate);

// const eurToUsd = 1.1;
// const movementsUsd = movements.map(el => el * eurToUsd);
// console.log(movementsUsd);

// const movementsDescriptions = movements.map((mov, i) => {
//   return `Movement ${i + 1}: You ${
//     mov > 0 ? 'depossite' : 'withdrew'
//   } ${Math.abs(mov)}`;
// });
// console.log(movementsDescriptions);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// const withdrawalsFor = [];
// for (const mov of movements) {
//   if (mov < 0) withdrawalsFor.push(mov);
// }
// console.log(withdrawalsFor);

// const balance = movements.reduce((acc, mov, i) => {
//   console.log(`Iteration ${i}: ${acc + mov}`);
//   return acc + mov;
// }, 0);
// console.log(balance);

// let balanceFor = 0;
// for (const [i, mov] of movements.entries()) {
//   console.log(`Iteration ${i}: ${balanceFor + mov}`);
//   balanceFor += mov;
// }
// console.log(balanceFor);

// const maxMovement = movements.reduce((acc, mov) =>
//   mov > acc ? (acc = mov) : acc
// );
// console.log(maxMovement);

// const dogsJulia = [5, 2, 4, 1, 15, 8, 3];
// const dogsKate = [4, 1, 15, 8, 3];

// const calcAverageHumanAge = ages => {
//   const humenAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   const adult = humenAge.filter(age => age >= 18);
//   const average = adult.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return average;
// };
// const avg1 = calcAverageHumanAge(dogsJulia);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const calcAverageHumanAgeArrow = ages => {
//   return ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// };
// console.log(calcAverageHumanAgeArrow(dogsJulia));

// const eurToUsd = 1.1;
// const totalDepositesUSD = movements
//   .filter(mov => mov > 0)
//   .reduce((acu, mov) => (acu += mov * eurToUsd), 0);
// console.log(totalDepositesUSD);

// for (const account of accounts) {
//   if (account.owner === 'Sarah Smith') console.log(account);
// }
// function divCon(x) {
//   return x
//     .map(str => +str)
//     .reduce((acu, sub, i) => {
//       if (i === 0) return acu + sub;

//       return acu - sub;
//     }, 0);
// }

// function divCon(x) {
//   const strNum = x
//     .filter(num => {
//       if (typeof num === 'string') return num;
//     })
//     .map(el => +el)
//     .reduce((acu, el) => acu + el, 0);
//   const nums = x
//     .filter(num => {
//       if (typeof num === 'number') return num;
//     })
//     .reduce((acu, el) => acu + el, 0);
//   return nums - strNum;
// }
// console.log(divCon([9, 3, '7', '3']));

// function last(x) {
//   return x
//     .split(' ')
//     .sort((a, b) => a.charCodeAt(a.length - 2) - b.charCodeAt(b.length - 2));
// }
// console.log(last('man i need a taxi up to ubud'));

// let pow = (base, exponent) => {
//   console.log(
//     Array(exponent)
//       .fill(base)
//       .reduce((acu, x) => acu * x, 1)
//   );
// };
// pow(2, 10);

// const arr = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];
// console.log(arr.flat());

// const arrDeep = [
//   [[1, 2], 3],
//   [4, [5, 6]],
//   [7, 8, 9],
// ];
// console.log(arrDeep.flat(2));

// Flat Method
// const overAllBalance = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acu, mov) => acu + mov, 0);
// console.log(overAllBalance);

// // FlatMap Method
// const overAllBalance2 = accounts
//   .flatMap(mov => mov.movements) // flatMap - ONLY one level deep
//   .reduce((acu, mov) => acu + mov, 0);
// console.log(overAllBalance);

// sort() Method
// return < 0, A, B (keep order)
// return > 0, B, A (switch order)
// movements.sort((a, b) => {
//   if (a > b) {
//     return 1;
//   }
//   if (b > a) {
//     return -1;
//   }
// });
// console.log(movements);
// movements.sort((a, b) => a - b);

// const dices100random = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 100)
// );
// console.log(dices100random);

// 1
// const allDeposit = accounts
//   .flatMap(el => el.movements)
//   .reduce((acu, el) => acu + el, 0);
// console.log(allDeposit);

// // 2
// const numDeposit1000 = accounts
//   .flatMap(el => el.movements)
//   .filter(el => el >= 50).length;
// console.log(numDeposit1000);

// // Prefixed ++ operator
// // let a = 10;
// // console.log(++a);

// //3
// const numDep1000withReduce = accounts
//   .flatMap(el => el.movements)
//   .reduce((acuLength, el) => (el >= 50 ? ++acuLength : acuLength), 0);
// console.log(numDep1000withReduce);

// const { deposits, withdrawals } = accounts
//   .flatMap(el => el.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, typeof withdrawals, withdrawals);

// // 4
// // this is a nice title -> This Is a Nice Titel
// const convertTitleCase = function (title) {
//   const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'in', 'on', 'with'];
//   const titelCase = title
//     .toLowerCase()
//     .split(' ')
//     .map((word, i) =>
//       exceptions.includes(word) && i !== 0
//         ? word
//         : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return titelCase;
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG titel but not too long'));
// console.log(convertTitleCase('and here is another titel with an EXAMPLE'));

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// // 1
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// // 2
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
//   `Sarah dog eating too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }`
// );
// // 3
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// .flat()
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooMuch);
// console.log(ownersEatTooLittle);

// // 4
// console.log(`${ownersEatTooMuch.join(' and ')}'s eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s eat too little!`);

// // 5
// console.log(`${dogs.curFood === dogs.recFood ? 'false' : 'true'}`);
// dogs.some(dog => {
//   if (dog.curFood === dog.recFood) {
//     console.log(
//       `The ${dog.owners.join(
//         ' and '
//       )}'s dog eat the same food that recommended!`
//     );
//   }
// });

// // 6
// const checkEatingOkay = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

// // 7
// console.log(dogs.filter(checkEatingOkay));

// // 8
// const dogsCopySorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsCopySorted);

// function oddOrEven(array) {
//   const sum = array.reduce((acu, el) => acu + el, 0);
//   return sum === [] ? 'array with zero' : sum % 2 === 0 ? 'even' : 'odd';
// }
// console.log(oddOrEven([0, 1, 5]));

// ----------------------------------------------- SECTION 12 - Numbers, Date, Int and Timer --------------------------------------------------------------

// console.log(23 === 23.0);
// console.log(0.1 + 0.2 === 0.3);

// // Converting
// console.log(Number('15'));
// console.log(+'15');

// // Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('se30', 10));

// console.log(Number.parseInt('  2.5 rem '));
// console.log(Number.parseFloat('  2.5 rem '));

// console.log('------');
// // Check if value is NaN
// console.log(Number.isNaN(7));
// console.log(Number.isNaN('7'));
// console.log(Number.isNaN(+'20w'));
// console.log(Number.isNaN(70 / 0));

// console.log('------');
// Check if value is number
// console.log(Number.isFinite(7));
// console.log(Number.isFinite('7'));
// console.log(Number.isFinite(+'7'));
// console.log(Number.isFinite(+'73e'));
// console.log(Number.isFinite(7 / 0));

// console.log('------');
// console.log(Number.isInteger(5));
// console.log(Number.isInteger(5.0));
// console.log(Number.isInteger(5 / 0));
// console.log(Number.isInteger(6 / 2));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(13, 34, 2, 4, 74, 2));
// console.log(Math.max(12, '34'));
// console.log(Math.max(12, '4px', 5));

// console.log(Math.min(13, 34, 2, 4, 74, 2));

// const roundInt = (max, min) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(roundInt(10, 5));

// Rounding decimals
// console.log((3.2).toFixed(0));
// console.log((3.2).toFixed(3));
// console.log((3.2544).toFixed(2));
// console.log(+(3.2556).toFixed(2));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 1) row.style.backgroundColor = 'green';
//     if (i % 2 === 0) row.style.backgroundColor = 'yellow';
//   });
// });

// console.log(2 ** 53 - 1);
// console.log(2 ** 53 + 2);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(257349574396064234534645754747n);
// console.log(BigInt(324325345));

// const bInt = BigInt(324325345);
// console.log(bInt + " It's realy huge number!");

// Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date('Thu Feb 25 2021 13:51:48'));
// console.log(new Date(' Sep 1, 2021'));

// console.log(new Date(2021, 10, 36));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(new Date(3 * 24 * 3600000));

// const future = new Date(2037, 10, 17, 3, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getSeconds());
// console.log(future.getMilliseconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142033780000));

// console.log(Date.now());

// future.setFullYear(2039);
// console.log(future);

// const fibonacci = n => {
//   let arrFib = [0, 1];
//   if (n < 1) return [];
//   for (let i = n - 2; i > 0; i--) {
//     let last = arrFib[arrFib.length - 1];
//     let prelast = arrFib[arrFib.length - 2];
//     arrFib.push(last + prelast);
//   }
//   return arrFib;
// };
// console.log(fibonacci(4));

// const future = new Date(2037, 11, 13);
// console.log(future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
// const days1 = calcDaysPassed(new Date(2037, 11, 10), future);
// console.log(days1);
