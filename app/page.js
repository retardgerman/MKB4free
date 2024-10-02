"use client"; // Enable client-side rendering

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Next.js Image component
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '../components/ui/dropdown-menu';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card'; // shadcn Card component
import imagesData from './images.json'; // Import local JSON file

export default function Home() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleImages, setVisibleImages] = useState(300); // Initially load 50 images

  // Image resolution for each format
  const imageSizes = {
    dhd: "Original size",
    dsd: "1920x1080",
    s: "918x800",
    wfs: "570x360",
    am: "144x144",
    as: "98x98",
  };

  // Load images from the local JSON file on component mount
  useEffect(() => {
    const loadImages = () => {
      const data = imagesData.data; // Access the "data" object in JSON
      const formattedImages = Object.keys(data).map(key => data[key]);
      setImages(formattedImages);
      setFilteredImages(formattedImages); // Initially show all images
    };
    loadImages();
  }, []);

  // Filter images based on search input
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = images.filter(image => {
      const firstImageUrl = Object.values(image)[0];
      const artistName = extractArtistName(firstImageUrl).toLowerCase();
      const imageName = extractImageName(firstImageUrl).toLowerCase();

      // Check if any image format matches the search query
      const qualityMatches = Object.keys(image).some(format => format.toLowerCase().includes(term));

      return artistName.includes(term) || imageName.includes(term) || qualityMatches;
    });

    setFilteredImages(filtered);
  }, [searchTerm, images]);

  // Helper function to extract artist name from URL
  const extractArtistName = (url) => {
    const match = url.match(/a~([^_/]+)/);
    return match ? match[1].replace(/~/g, '') : 'Unknown Artist'; // Remove ~ from artist name
  };

  // Helper function to extract image name from URL
  const extractImageName = (url) => {
    const pathParts = new URL(url).pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    return fileName.split('.')[0].replace(/~/g, ''); // Remove ~ from image name
  };

  // Determine which image format to show initially (smallest available)
  const getInitialImageFormat = (image) => {
    // Return the smallest format available
    return image.wfs || image.am || image.as || image.s || image.dsd || image.dhd || Object.values(image)[0];
  };

  // Download function to download the image from a URL
  const downloadImage = async (url, imageName) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${imageName}.jpg`; // Name the file after the image
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex justify-center">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold mb-4 text-center">MKB4free</h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by artist, image name, or quality..."
          className="w-full p-2 mb-6 border border-gray-600 rounded-md bg-gray-800 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          {filteredImages.slice(0, visibleImages).map((image, index) => (
            <Card key={index} className="bg-gray-800 text-white rounded-md shadow-lg max-w-xs mx-auto">
              <CardHeader>
                <Image
                  src={getInitialImageFormat(image)} // Show the smallest available image format
                  alt="Preview"
                  width={180} // Smaller width for the images
                  height={120} // Smaller height for the images
                  className="w-full h-auto object-cover rounded-t-md"
                  unoptimized={true} // Don't optimize external URL images
                />
              </CardHeader>

              <CardContent>
                <div className="mb-2">
                  <span className="font-semibold">Artist:</span> {extractArtistName(Object.values(image)[0])}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Image:</span> {extractImageName(Object.values(image)[0])}
                </div>
              </CardContent>

              <CardFooter>
                {/* Dropdown menu for download options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">Download Options</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {Object.keys(image).map((format) => (
                      <DropdownMenuItem
                        key={format}
                        className="w-full"
                        onClick={() => downloadImage(image[format], extractImageName(Object.values(image)[0]))}
                      >
                        {/* Show format name and resolution */}
                        {format.toUpperCase()} ({imageSizes[format] || "Unknown size"})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
