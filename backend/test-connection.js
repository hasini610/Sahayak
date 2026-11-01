import dotenv from 'dotenv';
dotenv.config();

import { testGeminiConnection } from './services/gemini.js';

async function run() {
  console.log('--- Testing Gemini API Connection for Sahayak ---');
  try {
    const result = await testGeminiConnection();
    console.log('✅ Connection Successful!');
    console.log(`Model: ${result.model}`);
    console.log('Response:\n', result.reply);
  } catch (error) {
    console.error('❌ Connection Failed:');
    console.error(error.message);
  }
}

run();

