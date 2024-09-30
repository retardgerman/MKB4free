import https from 'https';

export async function GET() {
  const url = 'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s';

  try {
    const jsonData = await fetchJson(url);
    if (!jsonData || !jsonData.data) {
      throw new Error('Invalid data format');
    }

    const images = extractImages(jsonData.data);
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch images', details: error.message }),
      { status: 500 }
    );
  }
}

// Function to fetch JSON data from external API
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Failed to parse JSON'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to extract images from the API response
function extractImages(data) {
  const images = [];
  for (const key in data) {
    const subproperty = data[key];
    if (subproperty) {
      const imageFormats = {};
      for (const format in subproperty) {
        if (subproperty[format]) {
          imageFormats[format] = subproperty[format];
        }
      }
      images.push(imageFormats);
    }
  }
  return images;
}
