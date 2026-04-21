const fetch = require('node-fetch');

async function test() {
    const res = await fetch('http://localhost:5000/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: 1, // Assuming Zeeshan is 1
            city: 'TestCity',
            gender: 'Male',
            payout_method: 'Easypaisa',
            payout_account: '03000000',
            phone: '0300000',
            social_link: 'fb.com/test'
        })
    });
    const data = await res.json();
    console.log(res.status, data);
}
test();
