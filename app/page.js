"use client"; // Client-side rendering aktivieren

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image'; // Next.js Image-Komponente
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '../components/ui/dropdown-menu';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card'; // Import shadcn Card-Komponente

export default function Home() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Auflösung für jedes Bildformat
  const imageSizes = {
    dhd: "Originalgröße",
    dsd: "1920x1080",
    s: "918x800",
    wfs: "570x360",
    am: "144x144",
    as: "98x98",
  };

  // Fetch images from API on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/images');
        setImages(response.data);
        setFilteredImages(response.data); // Initially, show all images
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
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

  // Helper function to extract artist name
  const extractArtistName = (url) => {
    const match = url.match(/a~([^_/]+)/);
    return match ? match[1] : 'Unknown Artist';
  };

  // Helper function to extract image name
  const extractImageName = (url) => {
    const pathParts = new URL(url).pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    return fileName.split('.')[0]; // Remove file extension
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4"> {/* Vollbild und dunkler Hintergrund */}
      <h1 className="text-3xl font-bold mb-4 text-center">MKB4free</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by artist, image name, or quality..."
        className="w-full p-2 mb-6 border border-gray-600 rounded-md bg-gray-800 text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2"> {/* Reduzierter Abstand */}
        {filteredImages.map((image, index) => (
          <Card key={index} className="bg-gray-800 text-white rounded-md shadow-lg max-w-xs mx-auto"> 
            <CardHeader>
              <Image
                src={image.wfs || Object.values(image)[0]} // Fallback, falls wfs nicht verfügbar ist
                alt="Preview"
                width={250} // Kleinere Breite für die Bilder
                height={150} // Kleinere Höhe für die Bilder
                className="w-full h-auto object-cover rounded-t-md"
                unoptimized={true} // Externe URL-Bilder nicht optimieren
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">Download</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.keys(image).map((format) => (
                    <DropdownMenuItem key={format}>
                      <a href={image[format]} target="_blank" rel="noopener noreferrer">
                        {format.toUpperCase()} ({imageSizes[format] || "Unbekannte Größe"})
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
