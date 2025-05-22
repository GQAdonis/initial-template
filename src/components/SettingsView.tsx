import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Check, Info, Save } from 'lucide-react';

const SettingsView = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="mt-0 space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Language Models</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Default Chat Model</CardTitle>
                  <CardDescription>
                    Select the default language model for chat interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chat-model">Model</Label>
                      <Select defaultValue="gpt-4">
                        <SelectTrigger id="chat-model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude-3">Claude 3</SelectItem>
                          <SelectItem value="llama-3">Llama 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="context-length">Context Length</Label>
                      <Select defaultValue="16k">
                        <SelectTrigger id="context-length">
                          <SelectValue placeholder="Select context length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4k">4K tokens</SelectItem>
                          <SelectItem value="8k">8K tokens</SelectItem>
                          <SelectItem value="16k">16K tokens</SelectItem>
                          <SelectItem value="32k">32K tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Temperature</Label>
                      <span className="text-sm text-muted-foreground">0.7</span>
                    </div>
                    <Slider defaultValue={[0.7]} min={0} max={2} step={0.1} />
                    <p className="text-xs text-muted-foreground">
                      Higher values produce more creative outputs, lower values are more deterministic
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Embedding Models</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Default Embedding Model</CardTitle>
                  <CardDescription>
                    Select the model used for creating vector embeddings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="embedding-model">Model</Label>
                    <Select defaultValue="openai-ada-002">
                      <SelectTrigger id="embedding-model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai-ada-002">OpenAI Ada 002</SelectItem>
                        <SelectItem value="openai-text-embedding-3">OpenAI Text Embedding 3</SelectItem>
                        <SelectItem value="cohere-embed">Cohere Embed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Image Models</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Default Image Generation Model</CardTitle>
                  <CardDescription>
                    Select the model used for generating images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="image-model">Model</Label>
                    <Select defaultValue="dalle-3">
                      <SelectTrigger id="image-model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dalle-3">DALL-E 3</SelectItem>
                        <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                        <SelectItem value="midjourney">Midjourney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-mode">Theme Mode</Label>
                  <Select defaultValue="system">
                    <SelectTrigger id="theme-mode">
                      <SelectValue placeholder="Select theme mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations throughout the interface
                    </p>
                  </div>
                  <Switch id="reduce-motion" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="font-size">Font Size</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust the base font size
                    </p>
                  </div>
                  <Select defaultValue="medium">
                    <SelectTrigger id="font-size" className="w-[120px]">
                      <SelectValue placeholder="Font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for various services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="openai-key" 
                      type="password" 
                      placeholder="sk-..." 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleSave}>
                      {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Your API keys are stored locally and never sent to our servers
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <div className="flex gap-2">
                    <Input id="anthropic-key" type="password" placeholder="sk-ant-..." />
                    <Button variant="outline">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stability-key">Stability AI Key</Label>
                  <div className="flex gap-2">
                    <Input id="stability-key" type="password" placeholder="sk-..." />
                    <Button variant="outline">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging for troubleshooting
                    </p>
                  </div>
                  <Switch id="debug-mode" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="local-models">Use Local Models When Available</Label>
                    <p className="text-sm text-muted-foreground">
                      Prioritize locally installed models over cloud APIs
                    </p>
                  </div>
                  <Switch id="local-models" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="cache-dir">Cache Directory</Label>
                  <Input id="cache-dir" defaultValue="~/.prometheus/cache" />
                  <p className="text-xs text-muted-foreground">
                    Location where temporary files and model weights are stored
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button variant="destructive" size="sm">
                    Clear Application Cache
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsView;
