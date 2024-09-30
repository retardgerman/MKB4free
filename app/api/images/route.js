import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Pfad zur JSON-Datei im app-Verzeichnis
    const filePath = path.join(process.cwd(), 'app', 'images.json');
    
    // Lese die JSON-Datei
    const jsonData = await fs.readFile(filePath, 'utf-8');
    
    // Parse die JSON-Daten
    const images = JSON.parse(jsonData);

    // Gib die JSON-Daten als Response zurück
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading local JSON file:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to read images from local JSON' }),
      { status: 500 }
    );
  }
}
