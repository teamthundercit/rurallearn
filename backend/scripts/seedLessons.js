import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';

dotenv.config();

const sampleLessons = [
  {
    title: 'Introduction to Mathematics',
    description: 'Learn the basics of mathematics including numbers, operations, and problem-solving.',
    content: {
      type: 'text',
      text: `# Introduction to Mathematics

Mathematics is the study of numbers, shapes, and patterns. It helps us understand the world around us and solve everyday problems.

## What is a Number?

Numbers are symbols we use to count and measure things. We use numbers every day - when we count money, tell time, or measure ingredients for cooking.

### Types of Numbers:
- **Natural Numbers**: 1, 2, 3, 4, 5... (counting numbers)
- **Whole Numbers**: 0, 1, 2, 3, 4... (natural numbers plus zero)
- **Integers**: ...-3, -2, -1, 0, 1, 2, 3... (positive and negative whole numbers)

## Basic Operations

The four basic operations in mathematics are:
1. **Addition (+)**: Combining numbers together
2. **Subtraction (-)**: Taking away from a number
3. **Multiplication (×)**: Repeated addition
4. **Division (÷)**: Splitting into equal parts

## Practice Problem

If you have 5 apples and your friend gives you 3 more apples, how many apples do you have in total?

Answer: 5 + 3 = 8 apples`
    },
    quiz: {
      questions: [
        {
          question: 'What are natural numbers?',
          options: [
            'Numbers used for counting (1, 2, 3...)',
            'Numbers that include zero',
            'Negative numbers',
            'Decimal numbers'
          ],
          correctAnswer: 0,
          explanation: 'Natural numbers are the counting numbers starting from 1: 1, 2, 3, 4, 5, and so on.'
        },
        {
          question: 'Which operation represents repeated addition?',
          options: [
            'Subtraction',
            'Division',
            'Multiplication',
            'Addition'
          ],
          correctAnswer: 2,
          explanation: 'Multiplication is repeated addition. For example, 3 × 4 means adding 3 four times: 3 + 3 + 3 + 3 = 12.'
        },
        {
          question: 'If you have 10 candies and give away 4, how many do you have left?',
          options: [
            '14',
            '6',
            '4',
            '10'
          ],
          correctAnswer: 1,
          explanation: 'This is a subtraction problem: 10 - 4 = 6 candies remaining.'
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['mathematics', 'basics', 'numbers']
  },
  {
    title: 'English Grammar: Parts of Speech',
    description: 'Understanding the building blocks of English sentences.',
    content: {
      type: 'text',
      text: `# Parts of Speech

Every word in English belongs to a category called a "part of speech." Understanding these categories helps us build correct sentences.

## The Eight Parts of Speech

### 1. Nouns
Words that name people, places, things, or ideas.
- Examples: teacher, school, book, happiness

### 2. Pronouns
Words that replace nouns.
- Examples: he, she, it, they, we

### 3. Verbs
Words that show action or state of being.
- Examples: run, jump, is, are, think

### 4. Adjectives
Words that describe nouns.
- Examples: beautiful, tall, red, happy

### 5. Adverbs
Words that describe verbs, adjectives, or other adverbs.
- Examples: quickly, very, well, often

### 6. Prepositions
Words that show relationships between nouns.
- Examples: in, on, at, under, between

### 7. Conjunctions
Words that connect other words or sentences.
- Examples: and, but, or, because

### 8. Interjections
Words that express emotion.
- Examples: wow!, ouch!, hey!

## Example Sentence

"The happy children quickly ran to the playground."
- The: Article (type of adjective)
- happy: Adjective
- children: Noun
- quickly: Adverb
- ran: Verb
- to: Preposition
- the: Article
- playground: Noun`
    },
    quiz: {
      questions: [
        {
          question: 'What part of speech is the word "beautiful"?',
          options: [
            'Noun',
            'Verb',
            'Adjective',
            'Adverb'
          ],
          correctAnswer: 2,
          explanation: '"Beautiful" is an adjective because it describes a noun (e.g., "a beautiful flower").'
        },
        {
          question: 'Which word is a pronoun in this sentence: "She gave him a book"?',
          options: [
            'gave',
            'She and him',
            'book',
            'a'
          ],
          correctAnswer: 1,
          explanation: '"She" and "him" are pronouns that replace the names of people.'
        },
        {
          question: 'What do verbs show?',
          options: [
            'Names of things',
            'Descriptions',
            'Action or state of being',
            'Connections between words'
          ],
          correctAnswer: 2,
          explanation: 'Verbs show action (like "run" or "jump") or state of being (like "is" or "are").'
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['english', 'grammar', 'language']
  },
  {
    title: 'Basic Science: The Water Cycle',
    description: 'Learn how water moves through our environment in a continuous cycle.',
    content: {
      type: 'mixed',
      text: `# The Water Cycle

The water cycle is the continuous movement of water on, above, and below the surface of the Earth. This process has been happening for billions of years!

## The Four Main Stages

### 1. Evaporation
When the sun heats water in rivers, lakes, or oceans, it turns into water vapor (gas) and rises into the air.

### 2. Condensation
As water vapor rises and cools, it turns back into tiny water droplets, forming clouds.

### 3. Precipitation
When clouds become heavy with water droplets, the water falls back to Earth as rain, snow, sleet, or hail.

### 4. Collection
Water collects in oceans, rivers, lakes, and underground. Then the cycle starts again!

## Why is the Water Cycle Important?

- Provides fresh water for plants, animals, and humans
- Helps regulate Earth's temperature
- Distributes water around the planet
- Cleans and purifies water naturally

## Fun Fact
The water you drink today is the same water that dinosaurs drank millions of years ago! Water is constantly recycled through the water cycle.`,
      videoUrl: 'https://www.youtube.com/watch?v=al-do-HGuIk'
    },
    quiz: {
      questions: [
        {
          question: 'What happens during evaporation?',
          options: [
            'Water falls from the sky',
            'Water turns into vapor and rises',
            'Water forms clouds',
            'Water collects in rivers'
          ],
          correctAnswer: 1,
          explanation: 'During evaporation, the sun heats water and it turns into water vapor (gas) that rises into the air.'
        },
        {
          question: 'What is precipitation?',
          options: [
            'Water vapor rising',
            'Clouds forming',
            'Water falling as rain, snow, or hail',
            'Water collecting in oceans'
          ],
          correctAnswer: 2,
          explanation: 'Precipitation is when water falls from clouds back to Earth as rain, snow, sleet, or hail.'
        },
        {
          question: 'Where does water collect after precipitation?',
          options: [
            'Only in clouds',
            'Only in the air',
            'In oceans, rivers, lakes, and underground',
            'Only in the sun'
          ],
          correctAnswer: 2,
          explanation: 'After precipitation, water collects in various places including oceans, rivers, lakes, and underground sources.'
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['science', 'environment', 'water']
  },
  {
    title: 'Introduction to Computer Programming',
    description: 'Learn the fundamental concepts of computer programming and coding.',
    content: {
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
      text: `# Introduction to Computer Programming

Programming is the process of creating instructions for computers to follow. These instructions are written in programming languages.

## What is a Program?

A program is a set of instructions that tells a computer what to do. Just like a recipe tells you how to cook a dish, a program tells a computer how to complete a task.

## Basic Programming Concepts

### 1. Variables
Variables store information that can be used and changed in your program.
Example: age = 15

### 2. Data Types
Different kinds of information:
- Numbers (integers, decimals)
- Text (strings)
- True/False (booleans)

### 3. Operators
Symbols that perform operations:
- Arithmetic: +, -, *, /
- Comparison: ==, !=, <, >
- Logical: AND, OR, NOT

### 4. Control Structures
- **If statements**: Make decisions
- **Loops**: Repeat actions
- **Functions**: Reusable blocks of code

## Your First Program

In many programming languages, the first program people write is "Hello, World!"

\`\`\`python
print("Hello, World!")
\`\`\`

This simple program displays the text "Hello, World!" on the screen.

## Why Learn Programming?

- Create websites and apps
- Solve complex problems
- Automate repetitive tasks
- Express creativity through technology
- High-demand career skill`
    },
    quiz: {
      questions: [
        {
          question: 'What is a variable in programming?',
          options: [
            'A type of computer',
            'A storage location for information',
            'A programming language',
            'A type of loop'
          ],
          correctAnswer: 1,
          explanation: 'A variable is a storage location that holds information which can be used and changed in your program.'
        },
        {
          question: 'Which of these is a control structure?',
          options: [
            'Variable',
            'Number',
            'If statement',
            'Text'
          ],
          correctAnswer: 2,
          explanation: 'An if statement is a control structure that allows programs to make decisions and execute different code based on conditions.'
        },
        {
          question: 'What does the "Hello, World!" program do?',
          options: [
            'Creates a website',
            'Displays text on the screen',
            'Stores data',
            'Deletes files'
          ],
          correctAnswer: 1,
          explanation: 'The "Hello, World!" program displays the text "Hello, World!" on the screen. It\'s traditionally the first program people write when learning a new language.'
        }
      ]
    },
    difficulty: 'intermediate',
    tags: ['programming', 'computer science', 'technology']
  },
  {
    title: 'World Geography: Continents and Oceans',
    description: 'Explore the major continents and oceans of our planet.',
    content: {
      type: 'text',
      text: `# Continents and Oceans

Our planet Earth is covered by large landmasses called continents and vast bodies of water called oceans.

## The Seven Continents

1. **Asia** - The largest continent, home to over 4 billion people
   - Countries: China, India, Japan, and many more
   - Features: Himalayas, Gobi Desert

2. **Africa** - The second largest continent
   - Countries: Egypt, Nigeria, South Africa, Kenya
   - Features: Sahara Desert, Nile River

3. **North America** - Includes Canada, USA, and Mexico
   - Features: Rocky Mountains, Great Lakes

4. **South America** - Home to the Amazon rainforest
   - Countries: Brazil, Argentina, Peru
   - Features: Amazon River, Andes Mountains

5. **Antarctica** - The coldest continent, mostly covered in ice
   - No permanent human residents
   - Home to penguins and seals

6. **Europe** - Known for its history and culture
   - Countries: France, Germany, Italy, UK
   - Features: Alps, Mediterranean Sea

7. **Australia** - The smallest continent, also a country
   - Features: Great Barrier Reef, Outback

## The Five Oceans

1. **Pacific Ocean** - The largest and deepest ocean
2. **Atlantic Ocean** - Separates Americas from Europe and Africa
3. **Indian Ocean** - Located between Africa, Asia, and Australia
4. **Southern Ocean** - Surrounds Antarctica
5. **Arctic Ocean** - The smallest ocean, around the North Pole

## Important Facts

- About 71% of Earth's surface is covered by water
- The Pacific Ocean is larger than all land areas combined
- Asia contains about 60% of the world's population
- Antarctica is the driest continent despite being covered in ice`
    },
    quiz: {
      questions: [
        {
          question: 'Which is the largest continent?',
          options: [
            'Africa',
            'Asia',
            'North America',
            'Europe'
          ],
          correctAnswer: 1,
          explanation: 'Asia is the largest continent, covering about 30% of Earth\'s land area and home to over 4 billion people.'
        },
        {
          question: 'Which ocean is the largest?',
          options: [
            'Atlantic Ocean',
            'Indian Ocean',
            'Pacific Ocean',
            'Arctic Ocean'
          ],
          correctAnswer: 2,
          explanation: 'The Pacific Ocean is the largest and deepest ocean, covering more area than all the land on Earth combined.'
        },
        {
          question: 'Which continent is also a country?',
          options: [
            'Europe',
            'Antarctica',
            'Australia',
            'Africa'
          ],
          correctAnswer: 2,
          explanation: 'Australia is unique in being both a continent and a country.'
        },
        {
          question: 'What percentage of Earth\'s surface is covered by water?',
          options: [
            'About 50%',
            'About 71%',
            'About 30%',
            'About 90%'
          ],
          correctAnswer: 1,
          explanation: 'About 71% of Earth\'s surface is covered by water, mostly in the form of oceans.'
        }
      ]
    },
    difficulty: 'intermediate',
    tags: ['geography', 'world', 'continents', 'oceans']
  },
  {
    title: 'Advanced Mathematics: Algebra Basics',
    description: 'Introduction to algebraic expressions, equations, and problem-solving.',
    content: {
      type: 'text',
      text: `# Introduction to Algebra

Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.

## What is Algebra?

Algebra allows us to solve problems where some information is unknown. We use letters (called variables) to represent these unknown values.

## Variables and Constants

- **Variable**: A letter that represents an unknown number (x, y, z)
- **Constant**: A fixed number that doesn't change (5, -3, 10)

## Algebraic Expressions

An algebraic expression combines variables, constants, and operations.

Examples:
- 3x + 5
- 2y - 7
- 4a + 3b - 2

## Equations

An equation states that two expressions are equal, using the = sign.

Examples:
- x + 5 = 12
- 2y = 10
- 3a - 4 = 11

## Solving Simple Equations

To solve an equation, we find the value of the variable that makes the equation true.

### Example 1: x + 5 = 12
- Subtract 5 from both sides
- x + 5 - 5 = 12 - 5
- x = 7

### Example 2: 2y = 10
- Divide both sides by 2
- 2y ÷ 2 = 10 ÷ 2
- y = 5

### Example 3: 3a - 4 = 11
- Add 4 to both sides: 3a = 15
- Divide both sides by 3: a = 5

## The Golden Rule

Whatever you do to one side of an equation, you must do to the other side to keep it balanced!

## Real-World Applications

Algebra helps us solve everyday problems:
- Calculating costs and budgets
- Determining distances and speeds
- Planning projects and schedules
- Understanding patterns and relationships`
    },
    quiz: {
      questions: [
        {
          question: 'What is a variable in algebra?',
          options: [
            'A fixed number',
            'A letter representing an unknown number',
            'An operation symbol',
            'An equation'
          ],
          correctAnswer: 1,
          explanation: 'A variable is a letter (like x, y, or z) that represents an unknown number in algebraic expressions and equations.'
        },
        {
          question: 'Solve for x: x + 7 = 15',
          options: [
            'x = 7',
            'x = 8',
            'x = 15',
            'x = 22'
          ],
          correctAnswer: 1,
          explanation: 'To solve x + 7 = 15, subtract 7 from both sides: x = 15 - 7 = 8.'
        },
        {
          question: 'What is the golden rule of solving equations?',
          options: [
            'Always add first',
            'Whatever you do to one side, do to the other',
            'Always multiply by 2',
            'Variables must be positive'
          ],
          correctAnswer: 1,
          explanation: 'The golden rule is that whatever operation you perform on one side of an equation, you must perform on the other side to keep it balanced.'
        },
        {
          question: 'Solve for y: 3y = 21',
          options: [
            'y = 3',
            'y = 7',
            'y = 18',
            'y = 24'
          ],
          correctAnswer: 1,
          explanation: 'To solve 3y = 21, divide both sides by 3: y = 21 ÷ 3 = 7.'
        }
      ]
    },
    difficulty: 'advanced',
    tags: ['mathematics', 'algebra', 'equations']
  }
];

const seedLessons = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing lessons...');
    await Lesson.deleteMany({});
    console.log('Existing lessons cleared');

    console.log('Inserting sample lessons...');
    const insertedLessons = await Lesson.insertMany(sampleLessons);
    console.log(`Successfully inserted ${insertedLessons.length} lessons`);

    console.log('\nLesson Summary:');
    insertedLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title} (${lesson.difficulty})`);
      console.log(`   - Type: ${lesson.content.type}`);
      console.log(`   - Tags: ${lesson.tags.join(', ')}`);
      console.log(`   - Quiz Questions: ${lesson.quiz.questions.length}`);
    });

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lessons:', error);
    process.exit(1);
  }
};

seedLessons();
