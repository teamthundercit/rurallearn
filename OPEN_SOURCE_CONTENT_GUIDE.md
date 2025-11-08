# Open Source Content Integration Guide

## 🎉 What's Been Added

I've integrated content from **4 major educational platforms**:

1. **Khan Academy** - Math, Science, Computing (CC BY-NC-SA 4.0)
2. **OpenStax** - Free textbooks (CC BY 4.0)
3. **MIT OpenCourseWare** - University courses (CC BY-NC-SA 4.0)
4. **Wikipedia** - General knowledge (CC BY-SA 3.0)

## 🚀 Quick Start

### Import All Open Source Content

```bash
cd backend
node scripts/importOpenSourceContent.js
```

This will import:
- ✅ Algebra lesson from Khan Academy
- ✅ Biology lesson from OpenStax
- ✅ Computer Science lesson from MIT
- ✅ 3 lessons from Wikipedia (Photosynthesis, Solar System, WWII)

### What You'll See

```
============================================================
Open Source Content Import Tool
============================================================

Connecting to MongoDB...
✓ Connected to MongoDB

Importing content from open source platforms...

1. Importing from Khan Academy...
✓ Imported 1 lessons from Khan Academy

2. Importing from OpenStax...
✓ Imported 1 lessons from OpenStax

3. Importing from MIT OpenCourseWare...
✓ Imported 1 lessons from MIT

4. Importing from Wikipedia...
✓ Imported: Photosynthesis
✓ Imported: Solar_System
✓ Imported: World_War_II

✓ Total lessons imported: 6

============================================================
Saving lessons to database...
============================================================

✓ Saved: Algebra Basics - Variables and Expressions
  Source: Khan Academy
  Tags: algebra, mathematics, variables, expressions
  License: CC BY-NC-SA 4.0

✓ Saved: Introduction to Biology - Cell Structure
  Source: OpenStax
  Tags: biology, science, cells, life science
  License: CC BY 4.0

✓ Saved: Introduction to Computer Science - Algorithms
  Source: MIT OpenCourseWare
  Tags: computer science, algorithms, programming, problem solving
  License: CC BY-NC-SA 4.0

... and more

============================================================
Import Summary
============================================================
✓ Successfully imported: 6 lessons
✗ Errors: 0
⊘ Skipped (duplicates): 0
============================================================

📚 Content Sources Used:
  • Khan Academy (CC BY-NC-SA 4.0)
  • OpenStax (CC BY 4.0)
  • MIT OpenCourseWare (CC BY-NC-SA 4.0)
  • Wikipedia (CC BY-SA 3.0)

✨ All content properly attributed and licensed!

✓ Import completed successfully!
```

## 📚 New Content Available

After import, you can search for:

### Khan Academy Content
- Tags: `algebra`, `mathematics`, `variables`, `expressions`
- Search: "algebra" or "math"

### OpenStax Content
- Tags: `biology`, `science`, `cells`, `life science`
- Search: "biology" or "cells"

### MIT Content
- Tags: `computer science`, `algorithms`, `programming`
- Search: "algorithms" or "computer science"

### Wikipedia Content
- Tags: `photosynthesis`, `solar system`, `world war ii`, `general knowledge`
- Search: "photosynthesis", "solar", or "war"

## 🎨 Attribution Display

All lessons now show proper attribution:

When viewing a lesson from an open source, you'll see:

```
┌─────────────────────────────────────────────┐
│ 📚 Content Source                           │
│                                             │
│ Content adapted from Khan Academy          │
│ (khanacademy.org) under CC BY-NC-SA 4.0   │
│ license                                     │
│                                             │
│ View original source →                      │
│ License: CC BY-NC-SA 4.0                   │
└─────────────────────────────────────────────┘
```

## 📝 Files Created/Modified

### New Files:
1. `backend/models/ContentSource.js` - Model for tracking sources
2. `backend/services/contentImportService.js` - Import logic
3. `backend/scripts/importOpenSourceContent.js` - Import script

### Modified Files:
1. `backend/models/Lesson.js` - Added source field
2. `frontend/src/pages/LessonPage.jsx` - Added attribution display

## 🔧 How It Works

### 1. Content Import Service

```javascript
// Import from Khan Academy
const khanLessons = await importFromKhanAcademy();

// Import from OpenStax
const openStaxLessons = await importFromOpenStax();

// Import from MIT
const mitLessons = await importFromMIT();

// Import from Wikipedia (live API)
const wikiLessons = await importFromWikipedia('Photosynthesis');
```

### 2. Lesson Structure with Source

```javascript
{
  title: "Algebra Basics",
  content: { ... },
  tags: ['algebra', 'math'],
  source: {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org/...',
    license: 'CC BY-NC-SA 4.0',
    attribution: 'Content from Khan Academy...'
  }
}
```

### 3. Attribution Display

The frontend automatically shows attribution for any lesson with a source.

## 📖 License Information

### Khan Academy (CC BY-NC-SA 4.0)
- ✅ Can use and adapt
- ✅ Must attribute
- ❌ No commercial use
- ✅ Share adaptations under same license

### OpenStax (CC BY 4.0)
- ✅ Can use and adapt
- ✅ Must attribute
- ✅ Commercial use allowed
- ✅ Can use different license

### MIT OpenCourseWare (CC BY-NC-SA 4.0)
- ✅ Can use and adapt
- ✅ Must attribute
- ❌ No commercial use
- ✅ Share adaptations under same license

### Wikipedia (CC BY-SA 3.0)
- ✅ Can use and adapt
- ✅ Must attribute
- ✅ Commercial use allowed
- ✅ Share adaptations under same license

## 🌐 Wikipedia Live Import

The Wikipedia importer uses the live API:

```javascript
// Import any Wikipedia article
const lessons = await importFromWikipedia('Artificial_Intelligence');
const lessons = await importFromWikipedia('Climate_Change');
const lessons = await importFromWikipedia('Ancient_Egypt');
```

## 🎯 Adding More Content

### Option 1: Add More Wikipedia Topics

Edit `backend/scripts/importOpenSourceContent.js`:

```javascript
const wikiTopics = [
  'Photosynthesis',
  'Solar_System',
  'World_War_II',
  // Add more topics:
  'Artificial_Intelligence',
  'Climate_Change',
  'Ancient_Egypt',
  'Shakespeare',
  'Quantum_Physics'
];
```

### Option 2: Expand Khan Academy Content

Edit `backend/services/contentImportService.js`:

Add more lessons to the `khanAcademyLessons` array.

### Option 3: Add More OpenStax Books

OpenStax has free textbooks on:
- Biology, Chemistry, Physics
- Math (Algebra, Calculus, Statistics)
- Social Sciences
- Business

Add more lessons to `openStaxLessons` array.

### Option 4: Add More MIT Courses

MIT OpenCourseWare has 2,500+ courses:
- Computer Science
- Mathematics
- Engineering
- Science

Add more lessons to `mitLessons` array.

## 🔄 Re-running the Import

The script is smart:
- ✅ Skips duplicate lessons (by title)
- ✅ Only imports new content
- ✅ Safe to run multiple times

```bash
# Run again to add new content
node scripts/importOpenSourceContent.js
```

## 🎓 Educational Use

This platform is perfect for:
- ✅ Rural education
- ✅ Non-profit learning
- ✅ Student projects
- ✅ Free educational access

All licenses allow educational use!

## ⚠️ Important Notes

1. **Attribution is Required** - Always shown on lesson pages
2. **Non-Commercial** - Some licenses restrict commercial use
3. **Share-Alike** - Some require same license for adaptations
4. **Original Sources** - Links provided to original content

## 🚀 Next Steps

1. **Run the import**:
   ```bash
   cd backend
   node scripts/importOpenSourceContent.js
   ```

2. **Test the content**:
   - Go to /lessons page
   - Search for "algebra", "biology", "algorithms"
   - Open a lesson and see attribution

3. **Add more topics**:
   - Edit the Wikipedia topics list
   - Add more lessons to each source
   - Run import again

## 📊 Content Statistics

After import, you'll have:
- Original lessons: ~11 (from previous seeds)
- Khan Academy: 1 lesson
- OpenStax: 1 lesson
- MIT: 1 lesson
- Wikipedia: 3 lessons
- **Total: ~17 lessons** with diverse topics!

## 🎉 Benefits

✅ **Legal** - All properly licensed
✅ **Attributed** - Sources clearly shown
✅ **Quality** - Content from trusted sources
✅ **Free** - No cost for educational use
✅ **Diverse** - Multiple subjects and levels
✅ **Expandable** - Easy to add more content

---

**Ready to import? Run the script and watch your content library grow!** 🚀
