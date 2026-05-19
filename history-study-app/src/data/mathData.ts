export interface MathQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MathTopic {
  id: string;
  chapter: string;
  title: string;
  tutorial: string;
  generateQuestion: () => MathQuestion;
}

function shuffle(array: string[]) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(n: number, d: number): string {
  const common = gcd(n, d);
  return `${n/common}/${d/common}`;
}

export const mathTopics: MathTopic[] = [
  {
    id: '6-3',
    chapter: '6',
    title: 'Distributive Property',
    tutorial: 'The distributive property lets you multiply a sum by multiplying each addend separately. Example: a(b + c) = ab + ac.',
    generateQuestion: () => {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 8) + 2;
      const correctAnswer = `${a * b} + ${a * c}`;
      return {
        question: `Use the distributive property to write an equivalent expression for ${a}(${b} + ${c}).`,
        options: shuffle([
          correctAnswer,
          `${a + b} + ${a + c}`,
          `${a * b} + ${c}`,
          `${a * b * c}`
        ]),
        correctAnswer,
        explanation: `Multiply ${a} by ${b} to get ${a*b}, and ${a} by ${c} to get ${a*c}. Then add them.`
      };
    }
  },
  {
    id: '6-4',
    chapter: '6',
    title: 'Least Common Multiple (LCM)',
    tutorial: 'The least common multiple is the smallest positive number that is a multiple of two or more numbers.',
    generateQuestion: () => {
      const a = Math.floor(Math.random() * 6) + 3; // 3 to 8
      const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const lcm = (a * b) / gcd(a, b);
      const correctAnswer = lcm.toString();
      return {
        question: `Find the least common multiple (LCM) of ${a} and ${b}.`,
        options: shuffle([
          correctAnswer,
          (lcm + a).toString(),
          (a * b).toString(),
          (lcm - Math.min(a, b)).toString()
        ].map(v => v === correctAnswer ? v : v === (a*b).toString() && lcm === a*b ? (lcm + 12).toString() : v)), // ensure distinct
        correctAnswer,
        explanation: `The multiples of ${a} and ${b} first intersect at ${lcm}.`
      };
    }
  },
  {
    id: '7-1',
    chapter: '7',
    title: 'Fractions in Simplest Form',
    tutorial: 'A fraction is in simplest form when the top and bottom cannot be any smaller, while still being whole numbers.',
    generateQuestion: () => {
      const factor = Math.floor(Math.random() * 5) + 2;
      const n = Math.floor(Math.random() * 5) + 1;
      const d = n + Math.floor(Math.random() * 5) + 1;
      const num = n * factor;
      const den = d * factor;
      const correctAnswer = simplifyFraction(num, den);
      return {
        question: `Write the fraction ${num}/${den} in simplest form.`,
        options: shuffle([
          correctAnswer,
          `${n}/${d+1}`,
          `${n+1}/${d}`,
          `${num / 2}/${den / 2}` // may not be simplest
        ]),
        correctAnswer,
        explanation: `Divide the numerator and denominator by their greatest common divisor, which is ${factor}.`
      };
    }
  },
  {
    id: '7-2',
    chapter: '7',
    title: 'Relate Fractions and Decimals',
    tutorial: 'Fractions and decimals are two ways to represent parts of a whole. E.g. 1/2 is 0.5.',
    generateQuestion: () => {
      const denoms = [2, 4, 5, 10, 20, 25, 50];
      const d = denoms[Math.floor(Math.random() * denoms.length)];
      const n = Math.floor(Math.random() * (d - 1)) + 1;
      const correctAnswer = (n / d).toString();
      return {
        question: `What decimal is equivalent to the fraction ${n}/${d}?`,
        options: shuffle([
          correctAnswer,
          (n / (d + 2)).toFixed(2),
          ((n + 1) / d).toFixed(2),
          (n / d + 0.1).toFixed(2)
        ]),
        correctAnswer,
        explanation: `Divide the numerator ${n} by the denominator ${d} to get ${correctAnswer}.`
      };
    }
  },
  {
    id: '7-3',
    chapter: '7',
    title: 'Rename Fractions as Decimals',
    tutorial: 'To rename a fraction as a decimal, divide the numerator by the denominator.',
    generateQuestion: () => {
      const num = Math.floor(Math.random() * 9) + 1;
      const den = 10;
      const correctAnswer = (num / den).toString();
      return {
        question: `Rename the fraction ${num}/${den} as a decimal.`,
        options: shuffle([
          correctAnswer,
          (num / 100).toString(),
          (num + 0.1).toString(),
          (num / 10 + 0.1).toFixed(1)
        ]),
        correctAnswer,
        explanation: `${num} divided by ${den} equals ${correctAnswer}.`
      };
    }
  },
  {
    id: '7-4',
    chapter: '7',
    title: 'Rename Decimals as Fractions',
    tutorial: 'To rename a decimal as a fraction, look at the place value of the last digit (e.g., 0.25 is 25 hundredths = 25/100 = 1/4).',
    generateQuestion: () => {
      const n = Math.floor(Math.random() * 19) + 1; // 1 to 19
      const dec = n / 20; // nice decimals
      const correctAnswer = simplifyFraction(n * 5, 100);
      return {
        question: `Rename the decimal ${dec} as a fraction in simplest form.`,
        options: shuffle([
          correctAnswer,
          `${n}/25`,
          `${n+1}/20`,
          simplifyFraction(n * 5 + 5, 100)
        ]),
        correctAnswer,
        explanation: `${dec} is ${dec * 100} hundredths, which simplifies to ${correctAnswer}.`
      };
    }
  },
  {
    id: '7-5',
    chapter: '7',
    title: 'Addition and Subtraction Expressions with Fractions',
    tutorial: 'To add or subtract fractions, they must have a common denominator.',
    generateQuestion: () => {
      const n1 = Math.floor(Math.random() * 3) + 1;
      const d1 = 4;
      const n2 = Math.floor(Math.random() * 2) + 1;
      const d2 = 2; // will be 2/4 or 4/4 equivalent
      const op = Math.random() > 0.5 ? '+' : '-';
      let correctN = op === '+' ? n1 * 1 + n2 * 2 : Math.abs(n1 * 1 - n2 * 2);
      let correctAnswer = simplifyFraction(correctN, 4);
      if (correctAnswer === '0/1' || correctAnswer === '0/4') correctAnswer = '0';
      return {
        question: `Evaluate the expression: ${n1}/${d1} ${op} ${n2}/${d2}`,
        options: shuffle([
          correctAnswer,
          simplifyFraction(correctN + 1, 4),
          simplifyFraction(correctN + 2, 4),
          simplifyFraction(Math.abs(correctN - 1), 4)
        ]),
        correctAnswer,
        explanation: `Find a common denominator (4), then ${op === '+' ? 'add' : 'subtract'} the numerators.`
      };
    }
  },
  {
    id: '7-6',
    chapter: '7',
    title: 'Addition and Subtraction Equations with Fractions',
    tutorial: 'To solve equations with fractions, isolate the variable by adding or subtracting the fraction from both sides.',
    generateQuestion: () => {
      const a = 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const d = 5;
      const op = Math.random() > 0.5 ? '+' : '-';
      const ansN = op === '+' ? b + a : Math.abs(b - a);
      const correctAnswer = simplifyFraction(ansN, d);
      return {
        question: `Solve for x: x ${op} ${a}/${d} = ${b}/${d}`,
        options: shuffle([
          correctAnswer,
          simplifyFraction(ansN + 1, d),
          simplifyFraction(ansN + 2, d),
          simplifyFraction(Math.abs(ansN - 1), d)
        ]),
        correctAnswer,
        explanation: `Isolate x by doing the inverse operation: ${op === '+' ? '-' : '+'} ${a}/${d} on both sides.`
      };
    }
  },
  {
    id: '8-1',
    chapter: '8',
    title: 'Multiply Fractions',
    tutorial: 'To multiply fractions, multiply the numerators together and the denominators together.',
    generateQuestion: () => {
      const n1 = Math.floor(Math.random() * 3) + 1;
      const d1 = 4;
      const n2 = Math.floor(Math.random() * 2) + 1;
      const d2 = 3;
      const correctAnswer = simplifyFraction(n1 * n2, d1 * d2);
      return {
        question: `Multiply: (${n1}/${d1}) × (${n2}/${d2})`,
        options: shuffle([
          correctAnswer,
          simplifyFraction(n1 * n2 + 1, d1 * d2),
          simplifyFraction(n1 * n2, d1 * d2 + 1),
          simplifyFraction(n1 * n2 + 2, d1 * d2)
        ]),
        correctAnswer,
        explanation: `Multiply numerators: ${n1}×${n2} = ${n1*n2}. Multiply denominators: ${d1}×${d2} = ${d1*d2}. Simplify if possible.`
      };
    }
  },
  {
    id: '8-3',
    chapter: '8',
    title: 'Meaning of Division by a Fraction',
    tutorial: 'Dividing by a fraction means finding out how many of that fraction fit into the dividend.',
    generateQuestion: () => {
      const whole = Math.floor(Math.random() * 4) + 2;
      const d = Math.floor(Math.random() * 3) + 2;
      const correctAnswer = (whole * d).toString();
      return {
        question: `How many 1/${d}s are in ${whole}? (Evaluate ${whole} ÷ 1/${d})`,
        options: shuffle([
          correctAnswer,
          (whole * d + 1).toString(),
          (whole * d - 1).toString(),
          (whole + d).toString()
        ]),
        correctAnswer,
        explanation: `There are ${d} parts of 1/${d} in each whole. So in ${whole} wholes, there are ${whole} × ${d} = ${correctAnswer} parts.`
      };
    }
  },
  {
    id: '8-5',
    chapter: '8',
    title: 'Divide Fractions by Fractions',
    tutorial: 'To divide by a fraction, keep the first fraction, change division to multiplication, and flip the second fraction (keep, change, flip).',
    generateQuestion: () => {
      const n1 = Math.floor(Math.random() * 3) + 1;
      const d1 = 4;
      const n2 = Math.floor(Math.random() * 2) + 1;
      const d2 = 3;
      const correctAnswer = simplifyFraction(n1 * d2, d1 * n2);
      return {
        question: `Divide: (${n1}/${d1}) ÷ (${n2}/${d2})`,
        options: shuffle([
          correctAnswer,
          simplifyFraction(n1 * n2, d1 * d2), // if they didn't flip
          simplifyFraction(d1 * n2, n1 * d2),
          simplifyFraction(n1 * d2 + 1, d1 * n2)
        ]),
        correctAnswer,
        explanation: `Keep ${n1}/${d1}, change to ×, flip to ${d2}/${n2}. Then multiply: (${n1}×${d2}) / (${d1}×${n2}) = ${correctAnswer}.`
      };
    }
  },
  {
    id: '8-8',
    chapter: '8',
    title: 'Order of Operations with Fractions',
    tutorial: 'Use PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction) just like with whole numbers.',
    generateQuestion: () => {
      // 1/2 * (1/4 + 1/4)
      const op = Math.random() > 0.5 ? '+' : '-';
      const n1 = op === '+' ? 1 : 3;
      const n2 = 1;
      const ansN = op === '+' ? n1 + n2 : n1 - n2; // ansN / 4
      const finalN = 1 * ansN;
      const finalD = 2 * 4;
      const correctAnswer = simplifyFraction(finalN, finalD);
      return {
        question: `Evaluate: 1/2 × (${n1}/4 ${op} ${n2}/4)`,
        options: shuffle([
          correctAnswer,
          simplifyFraction(finalN + 1, finalD),
          simplifyFraction(finalN + 2, finalD),
          simplifyFraction(Math.abs(finalN - 1), finalD)
        ]),
        correctAnswer,
        explanation: `Do parentheses first: ${n1}/4 ${op} ${n2}/4 = ${ansN}/4. Then multiply by 1/2: (1×${ansN})/(2×4) = ${correctAnswer}.`
      };
    }
  },
  {
    id: '9-1',
    chapter: '9',
    title: 'Integers',
    tutorial: 'Integers are all whole numbers and their negative opposites, including zero.',
    generateQuestion: () => {
      const val = Math.floor(Math.random() * 20) + 1;
      return {
        question: `What is the opposite of the integer ${val}?`,
        options: shuffle([
          `-${val}`,
          `${val}`,
          `1/${val}`,
          `0`
        ]),
        correctAnswer: `-${val}`,
        explanation: `The opposite of a positive integer is its negative counterpart.`
      };
    }
  },
  {
    id: '9-3',
    chapter: '9',
    title: 'Compare and Order Integers',
    tutorial: 'On a number line, numbers to the right are greater than numbers to the left.',
    generateQuestion: () => {
      const a = -Math.floor(Math.random() * 10) - 1;
      const b = -Math.floor(Math.random() * 10) - 15;
      const isGreater = a > b;
      return {
        question: `Which statement is true comparing ${a} and ${b}?`,
        options: shuffle([
          `${a} > ${b}`,
          `${a} < ${b}`,
          `${a} = ${b}`,
          `${a} is positive`
        ]),
        correctAnswer: isGreater ? `${a} > ${b}` : `${a} < ${b}`,
        explanation: `${a} is further to the right on the number line than ${b}, so it is greater.`
      };
    }
  },
  {
    id: '16-2',
    chapter: '16',
    title: 'Mean, Median, & Mode',
    tutorial: 'Mean is the average, Median is the middle number (when ordered), Mode is the most frequent number.',
    generateQuestion: () => {
      const type = ['Mean', 'Median', 'Mode'][Math.floor(Math.random() * 3)];
      const base = Math.floor(Math.random() * 5) + 2;
      const nums = [base, base, base+2, base+4, base+6];
      let ans = 0;
      if (type === 'Mean') ans = nums.reduce((a, b) => a + b) / 5;
      if (type === 'Median') ans = nums[2];
      if (type === 'Mode') ans = base;
      const shuffledNums = shuffle([...nums].map(String));
      return {
        question: `Find the ${type} of this data set: ${shuffledNums.join(', ')}`,
        options: shuffle([
          ans.toString(),
          (ans + 1).toString(),
          (ans - 1).toString(),
          (ans + 2).toString()
        ]),
        correctAnswer: ans.toString(),
        explanation: type === 'Mean' ? 'Add them all up and divide by 5.' : type === 'Median' ? 'Order the numbers and find the middle one.' : 'Find the number that appears most often.'
      };
    }
  },
  {
    id: '14-1',
    chapter: '14',
    title: 'Area of Parallelograms',
    tutorial: 'The area of a parallelogram is base × height (A = bh).',
    generateQuestion: () => {
      const b = Math.floor(Math.random() * 8) + 3;
      const h = Math.floor(Math.random() * 5) + 2;
      const area = b * h;
      return {
        question: `Find the area of a parallelogram with base ${b} and height ${h}.`,
        options: shuffle([
          `${area}`,
          `${area + 2}`,
          `${b + h}`,
          `${area / 2}`
        ]),
        correctAnswer: `${area}`,
        explanation: `Multiply the base (${b}) by the height (${h}) to get ${area}.`
      };
    }
  },
  {
    id: '14-2',
    chapter: '14',
    title: 'Area of Triangles',
    tutorial: 'The area of a triangle is half of its base times height (A = 1/2 × bh).',
    generateQuestion: () => {
      const b = (Math.floor(Math.random() * 5) + 2) * 2; // even to make math clean
      const h = Math.floor(Math.random() * 5) + 3;
      const area = (b * h) / 2;
      return {
        question: `Find the area of a triangle with base ${b} and height ${h}.`,
        options: shuffle([
          `${area}`,
          `${b * h}`, // common mistake
          `${area + 1}`,
          `${b + h}`
        ]),
        correctAnswer: `${area}`,
        explanation: `Multiply base (${b}) by height (${h}) and divide by 2: (${b}×${h})/2 = ${area}.`
      };
    }
  },
  {
    id: '10-1',
    chapter: '10',
    title: 'Ratios',
    tutorial: 'A ratio compares two quantities. It can be written as a:b, a to b, or a/b.',
    generateQuestion: () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 6;
      return {
        question: `A class has ${a} boys and ${b} girls. What is the ratio of boys to girls?`,
        options: shuffle([
          `${a}:${b}`,
          `${b}:${a}`,
          `${a}:${a+b}`,
          `${a+b}:${b}`
        ]),
        correctAnswer: `${a}:${b}`,
        explanation: `The number of boys is ${a} and girls is ${b}, so the ratio is ${a}:${b}.`
      };
    }
  },
  {
    id: '10-6',
    chapter: '10',
    title: 'Rates and Unit Rates',
    tutorial: 'A unit rate is a rate where the second quantity is 1 unit. Divide the first quantity by the second to find it.',
    generateQuestion: () => {
      const rate = Math.floor(Math.random() * 10) + 5;
      const hours = Math.floor(Math.random() * 3) + 2;
      const total = rate * hours;
      return {
        question: `If a car travels ${total} miles in ${hours} hours, what is its unit rate in miles per hour?`,
        options: shuffle([
          `${rate}`,
          `${rate + 5}`,
          `${total + hours}`,
          `${rate - 2}`
        ]),
        correctAnswer: `${rate}`,
        explanation: `Divide the total miles (${total}) by the hours (${hours}) to get ${rate} miles per 1 hour.`
      };
    }
  },
  {
    id: '11-1',
    chapter: '11',
    title: 'Percent',
    tutorial: 'Percent means "per 100". 45% means 45 out of 100.',
    generateQuestion: () => {
      const p = Math.floor(Math.random() * 90) + 5;
      return {
        question: `What fraction with a denominator of 100 represents ${p}%?`,
        options: shuffle([
          `${p}/100`,
          `100/${p}`,
          `${p}/10`,
          `${p+1}/100`
        ]),
        correctAnswer: `${p}/100`,
        explanation: `Percent means out of 100, so ${p}% is ${p}/100.`
      };
    }
  },
  {
    id: '11-3',
    chapter: '11',
    title: 'Relate Decimals and Percents',
    tutorial: 'To convert a decimal to a percent, move the decimal point two places to the right and add a % sign.',
    generateQuestion: () => {
      const dec = (Math.floor(Math.random() * 90) + 5) / 100;
      const pct = Math.round(dec * 100);
      return {
        question: `Write ${dec} as a percent.`,
        options: shuffle([
          `${pct}%`,
          `${pct/10}%`,
          `${pct*10}%`,
          `${dec}%`
        ]),
        correctAnswer: `${pct}%`,
        explanation: `Move the decimal two places right: ${dec} -> ${pct}%.`
      };
    }
  }
];
