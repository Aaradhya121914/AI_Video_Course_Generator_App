const cloudinary = require('cloudinary').v2;

// Configure Cloudinary inline with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  try {
    console.log('Uploading sample image to Cloudinary...');

    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      {
        folder: 'ai-course-generator-demo',
      }
    );

    console.log('Upload complete.');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    console.log('\nFetching image details...');
    const resource = await cloudinary.api.resource(uploadResult.public_id);
    console.log('Width:', resource.width);
    console.log('Height:', resource.height);
    console.log('Format:', resource.format);
    console.log('File size (bytes):', resource.bytes);

    // Create a transformed URL with automatic format and quality selection.
    // f_auto chooses the best image format supported by the browser.
    // q_auto chooses the best quality/size tradeoff automatically.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { fetch_format: 'auto' },
        { quality: 'auto' },
      ],
      secure: true,
    });

    console.log('\nDone! Click link below to see optimized version of the image. Check the size and the format.');
    console.log('Transformed URL:', transformedUrl);
  } catch (error) {
    console.error('Cloudinary error:', error);
    process.exit(1);
  }
}

main();
