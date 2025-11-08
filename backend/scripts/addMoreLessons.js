import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';

dotenv.config();

const additionalLessons = [
  {
    title: 'Introduction to Python Programming',
    description: 'Learn the basics of Python, one of the most popular programming languages.',
    content: {
      type: 'text',
      text: `# Introduction to Python Programming

Python is a powerful, easy-to-learn programming language used for web development, data science, automation, and more.

## Why Learn Python?

- **Easy to Read**: Python code looks like English
- **Versatile**: Used in many fields
- **Popular**: Large community and lots of resources
- **In-Demand**: Many job opportunities

## Your First Python Program

\`\`\`python
print("Hello, World!")
\`\`\`

This simple program displays "Hello, World!" on the screen.

## Variables in Python

Variables store information:

\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

## Basic Data Types

1. **Strings**: Text data ("hello")
2. **Integers**: Whole numbers (42)
3. **Floats**: Decimal numbers (3.14)
4. **Booleans**: True or False

## Simple Math Operations

\`\`\`python
x = 10
y = 3

print(x + y)  # Addition: 13
print(x - y)  # Subtraction: 7
print(x * y)  # Multiplication: 30
print(x / y)  # Division: 3.333...
\`\`\`

## Practice Exercise

Try writing a program that:
1. Stores your name in a variable
2. Stores your age in a variable
3. Prints a message like "My name is [name] and I am [age] years old"`
    },
    quiz: {
      questions: [
        {
          question: 'What does the print() function do in Python?',
          options: [
            'Saves data to a file',
            'Displays output on the screen',
            'Creates a variable',
            'Performs calculations'
          ],
          correctAnswer: 1,
          explanation: 'The print() function displays output on the screen.'
        },
        {
          question: 'Which of these is a valid variable name in Python?',
          options: [
            '2nd_variable',
            'my-variable',
            'my_variable',
            'my variable'
          ],
          correctAnswer: 2,
          explanation: 'Variable names can contain letters, numbers, and underscores, but cannot start with a number or contain spaces/hyphens.'
        },
        {
          question: 'What is the result of 10 / 3 in Python?',
          options: [
            '3',
            '3.0',
            '3.333...',
            'Error'
          ],
          correctAnswer: 2,
          explanation: 'Division in Python 3 always returns a float (decimal number).'
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['python', 'programming', 'coding', 'computer science', 'beginner']
  },
  {
    title: 'Basic Web Development with HTML',
    description: 'Learn to create web pages using HTML, the foundation of the web.',
    content: {
      type: 'text',
      text: `# Basic Web Development with HTML

HTML (HyperText Markup Language) is the standard language for creating web pages.

## What is HTML?

HTML uses "tags" to structure content on web pages. Tags are like instructions that tell the browser how to display content.

## Basic HTML Structure

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is my first paragraph.</p>
</body>
</html>
\`\`\`

## Common HTML Tags

### Headings
\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
\`\`\`

### Paragraphs
\`\`\`html
<p>This is a paragraph of text.</p>
\`\`\`

### Links
\`\`\`html
<a href="https://example.com">Click here</a>
\`\`\`

### Images
\`\`\`html
<img src="photo.jpg" alt="Description">
\`\`\`

### Lists
\`\`\`html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
\`\`\`

## Practice Project

Create a simple "About Me" page with:
- A heading with your name
- A paragraph about yourself
- A list of your hobbies
- A link to your favorite website`
    },
    quiz: {
      questions: [
        {
          question: 'What does HTML stand for?',
          options: [
            'High Tech Modern Language',
            'HyperText Markup Language',
            'Home Tool Markup Language',
            'Hyperlinks and Text Markup Language'
          ],
          correctAnswer: 1,
          explanation: 'HTML stands for HyperText Markup Language.'
        },
        {
          question: 'Which tag is used to create a link?',
          options: [
            '<link>',
            '<a>',
            '<href>',
            '<url>'
          ],
          correctAnswer: 1,
          explanation: 'The <a> (anchor) tag is used to create hyperlinks.'
        },
        {
          question: 'What is the correct HTML for the largest heading?',
          options: [
            '<heading>',
            '<h6>',
            '<h1>',
            '<head>'
          ],
          correctAnswer: 2,
          explanation: '<h1> creates the largest heading. Headings go from <h1> (largest) to <h6> (smallest).'
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['html', 'web development', 'programming', 'frontend', 'beginner']
  },
  {
    title: 'Introduction to Data Science',
    description: 'Discover the exciting world of data science and analytics.',
    content: {
      type: 'text',
      text: `# Introduction to Data Science

Data Science is the field of extracting insights and knowledge from data using scientific methods, algorithms, and systems.

## What is Data Science?

Data Science combines:
- **Statistics**: Understanding patterns in data
- **Programming**: Writing code to analyze data
- **Domain Knowledge**: Understanding the field you're studying
- **Communication**: Presenting findings clearly

## Why is Data Science Important?

In today's world, we generate massive amounts of data every day:
- Social media posts
- Online purchases
- Sensor readings
- Medical records
- Weather measurements

Data scientists help make sense of this data to:
- Make better business decisions
- Predict future trends
- Solve complex problems
- Improve products and services

## The Data Science Process

1. **Ask Questions**: What do we want to know?
2. **Collect Data**: Gather relevant information
3. **Clean Data**: Remove errors and inconsistencies
4. **Explore Data**: Look for patterns
5. **Analyze Data**: Use statistical methods
6. **Visualize Results**: Create charts and graphs
7. **Communicate Findings**: Share insights

## Real-World Applications

### Healthcare
- Predicting disease outbreaks
- Personalizing treatment plans
- Analyzing medical images

### Business
- Understanding customer behavior
- Optimizing pricing strategies
- Detecting fraud

### Environment
- Predicting weather patterns
- Monitoring climate change
- Tracking wildlife populations

### Sports
- Analyzing player performance
- Predicting game outcomes
- Optimizing training programs

## Getting Started

To become a data scientist, you should learn:
1. **Programming**: Python or R
2. **Statistics**: Probability and analysis
3. **Data Visualization**: Creating meaningful charts
4. **Machine Learning**: Teaching computers to learn from data

## Simple Example

Imagine you have data about students' study hours and test scores:
- Student A: 2 hours → 65%
- Student B: 5 hours → 85%
- Student C: 8 hours → 95%

A data scientist might discover: "More study hours generally lead to higher scores."

This insight could help students plan their study time better!`
    },
    quiz: {
      questions: [
        {
          question: 'What are the main components of Data Science?',
          options: [
            'Only programming',
            'Statistics, programming, domain knowledge, and communication',
            'Only mathematics',
            'Only visualization'
          ],
          correctAnswer: 1,
          explanation: 'Data Science combines statistics, programming, domain knowledge, and communication skills.'
        },
        {
          question: 'What is the first step in the Data Science process?',
          options: [
            'Collect data',
            'Clean data',
            'Ask questions',
            'Visualize results'
          ],
          correctAnswer: 2,
          explanation: 'The first step is to ask questions - defining what you want to learn from the data.'
        },
        {
          question: 'Which programming language is commonly used in Data Science?',
          options: [
            'HTML',
            'Python',
            'CSS',
            'SQL only'
          ],
          correctAnswer: 1,
          explanation: 'Python is one of the most popular programming languages for Data Science, along with R.'
        }
      ]
    },
    difficulty: 'intermediate',
    tags: ['data science', 'analytics', 'statistics', 'python', 'machine learning']
  },
  {
    title: 'Digital Literacy and Internet Safety',
    description: 'Learn how to use technology safely and responsibly.',
    content: {
      type: 'text',
      text: `# Digital Literacy and Internet Safety

In today's connected world, knowing how to use technology safely is essential.

## What is Digital Literacy?

Digital literacy means:
- Understanding how to use computers and the internet
- Knowing how to find reliable information online
- Being able to communicate effectively using technology
- Understanding digital rights and responsibilities

## Internet Safety Basics

### 1. Protect Your Personal Information

**Never share online:**
- Full name and address
- Phone number
- School name
- Passwords
- Financial information
- Photos that show your location

### 2. Create Strong Passwords

A strong password:
- Is at least 12 characters long
- Includes uppercase and lowercase letters
- Contains numbers and symbols
- Is unique for each account
- Doesn't contain personal information

**Example of a strong password:**
- Bad: password123
- Good: Tr33$&Sun2024!

### 3. Think Before You Click

- Don't click on suspicious links
- Verify email senders before opening attachments
- Be careful with pop-up windows
- Check website URLs before entering information

### 4. Social Media Safety

- Use privacy settings
- Think before you post
- Don't accept friend requests from strangers
- Report bullying or inappropriate content
- Remember: once posted, it's hard to delete

## Recognizing Online Scams

### Phishing Emails
Watch out for:
- Urgent requests for personal information
- Spelling and grammar errors
- Suspicious sender addresses
- Too-good-to-be-true offers

### Fake Websites
Check for:
- Secure connection (https://)
- Correct spelling of website name
- Professional design
- Contact information

## Digital Footprint

Everything you do online leaves a "digital footprint":
- Social media posts
- Comments on websites
- Photos you share
- Websites you visit

**Remember:** Future employers, schools, and others can see your digital footprint!

## Cyberbullying

If you experience cyberbullying:
1. Don't respond to the bully
2. Save evidence (screenshots)
3. Block the person
4. Tell a trusted adult
5. Report to the platform

## Healthy Technology Use

- Take regular breaks from screens
- Don't use devices before bedtime
- Balance online and offline activities
- Be present with family and friends

## Finding Reliable Information

When researching online:
1. Check multiple sources
2. Look for author credentials
3. Check the date of publication
4. Verify facts with trusted sources
5. Be skeptical of sensational headlines

## Your Digital Rights

You have the right to:
- Privacy online
- Control your personal data
- Report abuse
- Delete your accounts
- Access information

## Your Digital Responsibilities

You should:
- Respect others online
- Give credit for others' work
- Follow website rules and laws
- Report illegal or harmful content
- Help create a positive online community`
    },
    quiz: {
      questions: [
        {
          question: 'What makes a password strong?',
          options: [
            'Using your name and birthday',
            'At least 12 characters with mixed case, numbers, and symbols',
            'A simple word that\'s easy to remember',
            'Your phone number'
          ],
          correctAnswer: 1,
          explanation: 'A strong password should be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.'
        },
        {
          question: 'What should you do if you receive a suspicious email asking for personal information?',
          options: [
            'Reply with the information immediately',
            'Click all the links to investigate',
            'Delete it and report it as spam',
            'Forward it to all your contacts'
          ],
          correctAnswer: 2,
          explanation: 'Suspicious emails asking for personal information are likely phishing attempts. Delete and report them.'
        },
        {
          question: 'What is a digital footprint?',
          options: [
            'The size of your computer files',
            'The trace of your online activities',
            'Your computer\'s IP address',
            'The number of devices you own'
          ],
          correctAnswer: 1,
          explanation: 'A digital footprint is the trail of data you leave behind when using the internet.'
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['digital literacy', 'internet safety', 'cybersecurity', 'technology', 'online safety']
  },
  {
    title: 'Climate Change and Environmental Science',
    description: 'Understanding climate change and its impact on our planet.',
    content: {
      type: 'text',
      text: `# Climate Change and Environmental Science

Climate change is one of the most important challenges facing our world today.

## What is Climate Change?

Climate change refers to long-term shifts in global temperatures and weather patterns. While climate has changed throughout Earth's history, current changes are happening much faster due to human activities.

## The Greenhouse Effect

### Natural Greenhouse Effect
1. Sunlight reaches Earth
2. Earth absorbs energy and warms up
3. Earth radiates heat back to space
4. Some heat is trapped by greenhouse gases
5. This keeps Earth warm enough for life

### Enhanced Greenhouse Effect
Human activities have increased greenhouse gases, trapping more heat and warming the planet faster than natural processes.

## Main Greenhouse Gases

1. **Carbon Dioxide (CO₂)**
   - From burning fossil fuels
   - Deforestation
   - Industrial processes

2. **Methane (CH₄)**
   - From agriculture (livestock)
   - Landfills
   - Natural gas production

3. **Nitrous Oxide (N₂O)**
   - From fertilizers
   - Industrial activities

4. **Water Vapor (H₂O)**
   - Increases as temperature rises

## Evidence of Climate Change

### Rising Temperatures
- Global average temperature has increased by about 1.1°C since pre-industrial times
- The last decade was the warmest on record

### Melting Ice
- Arctic sea ice is declining
- Glaciers are shrinking worldwide
- Ice sheets in Greenland and Antarctica are losing mass

### Rising Sea Levels
- Sea levels have risen about 20cm since 1900
- Rate of rise is accelerating
- Threatens coastal communities

### Extreme Weather
- More frequent heatwaves
- Stronger hurricanes
- Increased flooding
- Longer droughts

## Impacts of Climate Change

### On Nature
- Species extinction
- Coral reef bleaching
- Changing migration patterns
- Ecosystem disruption

### On People
- Food and water scarcity
- Health risks from heat and disease
- Displacement of communities
- Economic impacts

### On Agriculture
- Changing growing seasons
- Crop failures
- Pest and disease spread
- Water availability issues

## What Can We Do?

### Individual Actions
1. **Reduce Energy Use**
   - Turn off lights and electronics
   - Use energy-efficient appliances
   - Adjust thermostat settings

2. **Transportation**
   - Walk, bike, or use public transport
   - Carpool when possible
   - Choose fuel-efficient vehicles

3. **Reduce, Reuse, Recycle**
   - Buy less stuff
   - Repair instead of replace
   - Recycle properly

4. **Food Choices**
   - Eat less meat
   - Buy local and seasonal food
   - Reduce food waste

5. **Plant Trees**
   - Trees absorb CO₂
   - Provide shade and cooling
   - Support biodiversity

### Community Actions
- Support renewable energy projects
- Advocate for climate policies
- Educate others
- Participate in local environmental groups

### Global Solutions
- Transition to renewable energy
- Protect and restore forests
- Develop sustainable agriculture
- Invest in green technology
- International cooperation

## Renewable Energy Sources

1. **Solar Power**
   - Energy from the sun
   - Clean and abundant
   - Costs decreasing

2. **Wind Power**
   - Energy from wind turbines
   - No emissions
   - Growing rapidly

3. **Hydroelectric Power**
   - Energy from flowing water
   - Reliable and clean
   - Established technology

4. **Geothermal Energy**
   - Heat from Earth's core
   - Constant and reliable
   - Low emissions

## Hope for the Future

While climate change is serious, we can still make a difference:
- Technology is improving
- Renewable energy is becoming cheaper
- More people are taking action
- Young people are leading change
- Solutions exist - we need to implement them

## Your Role

Every action counts:
- Learn about climate change
- Make sustainable choices
- Inspire others
- Support climate-friendly policies
- Stay hopeful and active

Remember: We all share this planet, and together we can protect it for future generations!`
    },
    quiz: {
      questions: [
        {
          question: 'What is the main cause of current climate change?',
          options: [
            'Natural climate cycles',
            'Volcanic eruptions',
            'Human activities increasing greenhouse gases',
            'Changes in Earth\'s orbit'
          ],
          correctAnswer: 2,
          explanation: 'Current climate change is primarily caused by human activities that increase greenhouse gases in the atmosphere.'
        },
        {
          question: 'Which of these is a renewable energy source?',
          options: [
            'Coal',
            'Natural gas',
            'Solar power',
            'Oil'
          ],
          correctAnswer: 2,
          explanation: 'Solar power is a renewable energy source. Coal, natural gas, and oil are fossil fuels.'
        },
        {
          question: 'What can individuals do to help fight climate change?',
          options: [
            'Nothing - only governments can help',
            'Reduce energy use, recycle, and use sustainable transportation',
            'Use more plastic products',
            'Ignore the problem'
          ],
          correctAnswer: 1,
          explanation: 'Individuals can make a difference through actions like reducing energy use, recycling, and choosing sustainable transportation.'
        }
      ]
    },
    difficulty: 'intermediate',
    tags: ['climate change', 'environment', 'science', 'sustainability', 'ecology']
  }
];

const addLessons = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\nAdding new lessons...');
    const insertedLessons = await Lesson.insertMany(additionalLessons);
    console.log(`✓ Successfully added ${insertedLessons.length} new lessons`);

    console.log('\nNew lessons added:');
    insertedLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title}`);
      console.log(`   Tags: ${lesson.tags.join(', ')}`);
      console.log(`   Difficulty: ${lesson.difficulty}`);
    });

    console.log('\n✓ All lessons added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding lessons:', error);
    process.exit(1);
  }
};

addLessons();
