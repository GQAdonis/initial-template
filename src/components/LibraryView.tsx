import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Folder, FileText, MoreHorizontal } from 'lucide-react';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  lastUpdated: string;
}

const LibraryView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for knowledge bases
  const knowledgeBases: KnowledgeBase[] = [
    {
      id: 'kb1',
      name: 'Product Documentation',
      description: 'Technical documentation for our products and services',
      documentCount: 42,
      lastUpdated: '2025-05-15'
    },
    {
      id: 'kb2',
      name: 'Research Papers',
      description: 'Collection of academic papers and research',
      documentCount: 18,
      lastUpdated: '2025-05-10'
    },
    {
      id: 'kb3',
      name: 'Company Policies',
      description: 'Internal company policies and procedures',
      documentCount: 15,
      lastUpdated: '2025-04-28'
    }
  ];
  
  const filteredKnowledgeBases = knowledgeBases.filter(kb => 
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    kb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <h1 className="text-xl font-bold">Knowledge Library</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="knowledge-bases" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="knowledge-bases">Knowledge Bases</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>
          
          <TabsContent value="knowledge-bases" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredKnowledgeBases.map((kb) => (
                <Card key={kb.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{kb.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{kb.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Folder className="h-4 w-4 mr-1" />
                      <span>{kb.documentCount} documents</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-muted-foreground">
                    Last updated: {kb.lastUpdated}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <div className="rounded-md border">
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documents..."
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center p-2 hover:bg-muted rounded-md">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Document {i}.pdf</div>
                        <div className="text-sm text-muted-foreground">Added on May {i + 10}, 2025</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LibraryView;
