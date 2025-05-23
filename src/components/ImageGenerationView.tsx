import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Image as ImageIcon, RefreshCw, Sparkles } from 'lucide-react';
import { useImagesStore } from '@/stores/images-store';

const ImageGenerationView = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('stable-diffusion');
  const [size, setSize] = useState('512x512');
  const { images, isGenerating, generateImage } = useImagesStore();
  
  // Handle image generation
  const handleGenerateImages = async () => {
    if (!prompt.trim()) return;
    await generateImage(prompt, model, size);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <h1 className="text-xl font-bold">Image Generation</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="text-to-image" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="text-to-image">Text to Image</TabsTrigger>
            <TabsTrigger value="image-to-image">Image to Image</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text-to-image" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea 
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[120px] resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Select 
                      value={model} 
                      onValueChange={setModel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                        <SelectItem value="dalle">DALL-E</SelectItem>
                        <SelectItem value="midjourney">Midjourney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Size</label>
                    <Select 
                      value={size} 
                      onValueChange={setSize}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="256x256">256x256</SelectItem>
                        <SelectItem value="512x512">512x512</SelectItem>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Number of Images</label>
                    <span className="text-sm text-muted-foreground">4</span>
                  </div>
                  <Slider defaultValue={[4]} min={1} max={8} step={1} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Creativity</label>
                    <span className="text-sm text-muted-foreground">Medium</span>
                  </div>
                  <Slider defaultValue={[50]} min={0} max={100} step={1} />
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={handleGenerateImages}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Images
                    </>
                  )}
                </Button>
              </div>
              
              {/* Right side - Results */}
              <div>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(0, 4).map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <CardContent className="p-0 relative group">
                          <img 
                            src={image.imageUrl} 
                            alt={image.title}
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No images generated yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter a prompt and click the generate button to create images
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Your Generated Images</h2>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <CardContent className="p-0 relative group">
                        <img 
                          src={image.imageUrl} 
                          alt={image.title}
                          className="w-full h-auto aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium truncate">{image.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{image.model}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your Gallery is Empty</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate some images to see them here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="image-to-image" className="mt-0">
            <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Image to Image Generation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload an image and transform it using AI
              </p>
              <Button>
                Upload Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImageGenerationView;
