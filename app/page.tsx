"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '../components/ui/dropdown-menu';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import imagesData from './images.json';

// Define types for the image data
interface ImageFormats {
  dhd?: string;
  dsd?: string;
  s?: string;
  wfs?: string;
  am?: string;
  as?: string;
  [key: string]: string | undefined; // To handle other potential keys
}

export default function Home() {
  const [images, setImages] = useState<ImageFormats[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageFormats[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleImages, setVisibleImages] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);

  // Image resolution for each format
  const imageSizes: Record<string, string> = {
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
      setLoading(true);
      const data: Record<string, ImageFormats> = imagesData?.data || {};
      const formattedImages = Object.keys(data).map(key => data[key]);
      setImages(formattedImages);
      setFilteredImages(formattedImages);
      setLoading(false);
    };
    loadImages();
  }, []);

  // Filter images based on search input
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = images.filter(image => {
      const firstImageUrl = Object.values(image)[0] || '';
      const artistName = extractArtistName(firstImageUrl).toLowerCase();
      const imageName = extractImageName(firstImageUrl).toLowerCase();

      const qualityMatches = Object.keys(image).some(format => format.toLowerCase().includes(term));

      return artistName.includes(term) || imageName.includes(term) || qualityMatches;
    });

    setFilteredImages(filtered);
  }, [searchTerm, images]);

  // Helper function to extract artist name from URL
  const extractArtistName = (url: string): string => {
    try {
      const match = url.match(/a~([^_/]+)/);
      return match ? match[1].replace(/~/g, '') : 'Unknown Artist';
    } catch (error) {
      console.error('Error extracting artist name:', error);
      return 'Unknown Artist';
    }
  };

  // Helper function to extract image name from URL
  const extractImageName = (url: string): string => {
    try {
      const pathParts = new URL(url).pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      return fileName.split('.')[0].replace(/~/g, '');
    } catch (error) {
      console.error('Error extracting image name:', error);
      return 'Unknown Image';
    }
  };

  // Get initial image format (smallest available)
  const getInitialImageFormat = (image: ImageFormats): string => {
    return image.wfs || image.am || image.as || image.s || image.dsd || image.dhd || Object.values(image)[0] || '';
  };

  // Download function to download the image from a URL
  const downloadImage = async (url: string, imageName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Load more images for lazy loading
  const loadMoreImages = () => {
    setVisibleImages(prev => prev + 50);
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />

        {/* Loading indicator */}
        {loading && <p className="text-center">Loading images...</p>}

        {/* No images found */}
        {!loading && filteredImages.length === 0 && (
          <p className="text-center">No images found. Try a different search.</p>
        )}

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          {filteredImages.slice(0, visibleImages).map((image, index) => (
            <Card key={index} className="bg-gray-800 text-white rounded-md shadow-lg max-w-xs mx-auto">
              <CardHeader>
                <Image
                  src={getInitialImageFormat(image)}
                  alt="Preview"
                  width={180}
                  height={120}
                  className="w-full h-auto object-cover rounded-t-md"
                  unoptimized
                />
              </CardHeader>

              <CardContent>
                <div className="mb-2">
                  <span className="font-semibold">Artist:</span> {extractArtistName(Object.values(image)[0] || '')}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Image:</span> {extractImageName(Object.values(image)[0] || '')}
                </div>
              </CardContent>

              <CardFooter>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">Download Options</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {Object.keys(image).map((format) => (
                      <DropdownMenuItem
                        key={format}
                        onClick={() => downloadImage(image[format] || '', extractImageName(Object.values(image)[0] || ''))}
                      >
                        {format.toUpperCase()} ({imageSizes[format] || "Unknown size"})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load more button for lazy loading */}
        {visibleImages < filteredImages.length && (
          <div className="text-center mt-6">
            <Button onClick={loadMoreImages} className="bg-blue-500 text-white hover:bg-blue-600">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
