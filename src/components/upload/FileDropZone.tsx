import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SchemaFile } from '@/types/migration';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  files: SchemaFile[];
  accept?: string;
  title: string;
  description: string;
  className?: string;
}

export function FileDropZone({
  onFilesAdded,
  onFileRemove,
  files,
  accept = '.sql,.ddl,.json,.csv,.cpy',
  title,
  description,
  className,
}: FileDropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.sql', '.ddl', '.json', '.csv', '.cpy'],
      'application/json': ['.json'],
    },
    multiple: true,
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <File className="h-4 w-4" />;
  };

  const getStatusColor = (status: SchemaFile['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600';
      case 'processing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressValue = (status: SchemaFile['status']) => {
    switch (status) {
      case 'uploading':
        return 25;
      case 'processing':
        return 75;
      case 'completed':
        return 100;
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-muted/50',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border',
          files.length === 0 ? 'min-h-[200px] flex items-center justify-center' : 'min-h-[120px]'
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Supported formats: {accept}
          </div>
        </div>
      </div>

    </div>
  );
}