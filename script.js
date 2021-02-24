'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
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
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov > 0 ? '£' + mov : mov + '£'}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} GBP`;
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
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acu, mov) => acu + mov);
  labelSumIn.textContent = `£${incomes}`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acu, mov) => acu + mov);
  labelSumOut.textContent = `£${Math.abs(outcomes)}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(dep => dep >= 1)
    .reduce((acu, int) => acu + int, 0);
  labelSumInterest.textContent = `£${interest}`;
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
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

    // Update UI
    updateUI(currentAccount);
  }
  console.log(receiverAcc);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
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
    currentAccount.pin === Number(inputClosePin.value)
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
  displayMovements(currentAccount.movements, !sorted);
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
const allDeposit = accounts
  .flatMap(el => el.movements)
  .reduce((acu, el) => acu + el, 0);
console.log(allDeposit);

// 2
const numDeposit1000 = accounts
  .flatMap(el => el.movements)
  .filter(el => el >= 50).length;
console.log(numDeposit1000);

// Prefixed ++ operator
// let a = 10;
// console.log(++a);

//3
const numDep1000withReduce = accounts
  .flatMap(el => el.movements)
  .reduce((acuLength, el) => (el >= 50 ? ++acuLength : acuLength), 0);
console.log(numDep1000withReduce);

const { deposits, withdrawals } = accounts
  .flatMap(el => el.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, typeof withdrawals, withdrawals);

// 4
// this is a nice title -> This Is a Nice Titel
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'in', 'on', 'with'];
  const titelCase = title
    .toLowerCase()
    .split(' ')
    .map((word, i) =>
      exceptions.includes(word) && i !== 0
        ? word
        : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titelCase;
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG titel but not too long'));
console.log(convertTitleCase('and here is another titel with an EXAMPLE'));
