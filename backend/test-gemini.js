import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('Testing Gemini API...');
console.log('API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'NOT SET');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
    try {
        console.log('\nAttempting to connect to Gemini API...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log('Sending test prompt...');
        const result = await model.generateContent('Say hello in exactly 5 words');
        const response = await result.response;

        console.log('\n✅ SUCCESS! Gemini API is working!');
        console.log('Response:', response.text());
        console.log('\nYour API key is valid and ready to use.');
    } catch (error) {
        console.error('\n❌ ERROR: Gemini API test failed');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);

        if (error.message.includes('API key not valid')) {
            console.error('\n🔑 Your API key is invalid or expired.');
            console.error('\nTo get a new API key:');
            console.error('1. Visit: https://aistudio.google.com/app/apikey');
            console.error('2. Sign in with your Google account');
            console.error('3. Click "Create API key"');
            console.error('4. Copy the new key');
            console.error('5. Replace GEMINI_API_KEY in backend/.env');
            console.error('6. Restart your backend server');
        } else if (error.message.includes('quota')) {
            console.error('\n⚠️  API quota exceeded. Wait a moment and try again.');
        } else {
            console.error('\n⚠️  Unknown error. Check your internet connection.');
        }

        console.error('\n💡 Note: Your app will work in fallback mode without a valid key.');
        console.error('   You\'ll get rule-based recommendations instead of AI-powered ones.');
    }
}

testGemini();
