
import { fetchEmails } from './server/imapService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('Testing IMAP Service...');
    try {
        const result = await fetchEmails();
        console.log('Success:', result);
    } catch (error) {
        console.error('Failed:', error);
    }
}

test();
