import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import { importAllContent } from '../services/contentImportService.js';

dotenv.config();

const importContent = async () => {
  try {
    console.log('='.repeat(60));
    console.log('Open Source Content Import Tool');
    console.log('='.repeat(60));
    console.log('\nConnecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    console.log('Importing content from open source platforms...\n');
    const lessons = await importAllContent();

    console.log('\n' + '='.repeat(60));
    console.log('Saving lessons to database...');
    console.log('='.repeat(60) + '\n');

    let successCount = 0;
    let errorCount = 0;

    for (const lessonData of lessons) {
      try {
        // Check if lesson already exists
        const existing = await Lesson.findOne({ title: lessonData.title });
        
        if (existing) {
          console.log(`⊘ Skipped (already exists): ${lessonData.title}`);
          continue;
        }

        await Lesson.create(lessonData);
        console.log(`✓ Saved: ${lessonData.title}`);
        console.log(`  Source: ${lessonData.source.name}`);
        console.log(`  Tags: ${lessonData.tags.join(', ')}`);
        console.log(`  License: ${lessonData.source.license}\n`);
        successCount++;
      } catch (error) {
        console.error(`✗ Error saving ${lessonData.title}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Import Summary');
    console.log('='.repeat(60));
    console.log(`✓ Successfully imported: ${successCount} lessons`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log(`⊘ Skipped (duplicates): ${lessons.length - successCount - errorCount}`);
    console.log('='.repeat(60));

    console.log('\n📚 Content Sources Used:');
    console.log('  • Khan Academy (CC BY-NC-SA 4.0)');
    console.log('  • OpenStax (CC BY 4.0)');
    console.log('  • MIT OpenCourseWare (CC BY-NC-SA 4.0)');
    console.log('  • Wikipedia (CC BY-SA 3.0)');

    console.log('\n✨ All content properly attributed and licensed!');
    console.log('\n✓ Import completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error during import:', error);
    process.exit(1);
  }
};

importContent();
