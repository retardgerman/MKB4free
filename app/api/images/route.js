// app/api/images/route.js
import https from 'https';

export async function GET(request) {
  const url = 'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s';

  try {
    const jsonData = await fetchJson(url);
    const images = extractImages(jsonData.data);
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), { status: 500 });
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
        resolve(JSON.parse(data));
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
        imageFormats[format] = subproperty[format];
      }
      images.push(imageFormats);
    }
  }
  return images;
}
