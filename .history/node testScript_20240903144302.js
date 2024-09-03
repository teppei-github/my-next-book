const fetch = require('node-fetch');

const testApiRequest = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'J185NUAzt2RBKV8tdUNwoH76M7p2',
        bookId: 'IdbvBQAAQBAJ',
        title: '',
        author: '',
        price: 0,
        publisher: '',
        published: new Date().toISOString(),
        image: ''
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
    }

    const result = await response.json();
    console.log('API response:', result);
  } catch (error) {
    console.error('APIリクエスト中にエラーが発生しました:', error);
  }
};

testApiRequest();
