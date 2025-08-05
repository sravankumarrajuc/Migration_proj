import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Copy, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  readOnly?: boolean;
  height?: string;
  onChange?: (value: string) => void;
}

export function CodeEditor({ 
  code, 
  language, 
  readOnly = false, 
  height = "400px",
  onChange 
}: CodeEditorProps) {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor theme and options
    editor.updateOptions({
      fontSize: 13,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      selectOnLineNumbers: true,
      automaticLayout: true
    });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code copied",
        description: "Code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const editorComponent = (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {language}
          </span>
          {readOnly && (
            <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
              Read Only
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            disabled={!code || code === '// Generating code...'}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className={isFullscreen ? 'h-[calc(100vh-48px)]' : ''}>
        <Editor
          height={isFullscreen ? '100%' : height}
          language={language}
          value={code}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={(value) => onChange?.(value || '')}
          options={{
            readOnly,
            minimap: { enabled: !readOnly },
            scrollBeyondLastLine: false,
            fontSize: 13,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            selectOnLineNumbers: true,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'none',
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
          }}
        />
      </div>
    </div>
  );

  return editorComponent;
}