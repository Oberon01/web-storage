#!/usr/bin/env node

/**
 * Password Hashing Utility
 * 
 * This script helps you generate bcrypt hashed passwords for production use.
 * 
 * Usage:
 *   node scripts/hash-password.js yourpassword
 *   
 * Or run interactively:
 *   node scripts/hash-password.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Password provided as argument
    const password = args[0];
    console.log('\n🔐 Generating password hash...\n');
    const hash = await hashPassword(password);
    console.log('Password:', password);
    console.log('Hashed:', hash);
    console.log('\n📝 Copy the hashed password above to your .env.local file:');
    console.log(`ADMIN_PASSWORD=${hash}\n`);
    return;
  }
  
  // Interactive mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('\n🔐 Password Hashing Utility\n');
  
  rl.question('Enter password to hash: ', async (password) => {
    if (!password) {
      console.log('❌ No password provided');
      rl.close();
      return;
    }
    
    console.log('\n⏳ Generating hash...\n');
    const hash = await hashPassword(password);
    
    console.log('✅ Password hashed successfully!\n');
    console.log('Original password:', password);
    console.log('Hashed password:', hash);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`ADMIN_PASSWORD=${hash}\n`);
    console.log('⚠️  Make sure to keep your original password in a safe place!\n');
    
    rl.close();
  });
}

main().catch(console.error);
