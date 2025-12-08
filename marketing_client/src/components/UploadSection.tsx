import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// 1. Update Interface to include fileType
interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  fileType?: string;
  existingImageUrl?: string;
}

// 2. Destructure fileType from the props object, set a default value
const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileType = "Image/Doc", existingImageUrl = "" }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Construct full image URL if it's a relative path
  const getFullImageUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    return `${serverUrl}${url}`;
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle manual selection via button
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Common file processing logic
  const handleFile = (file: File) => {
    // Basic validation: Check if it's an image
    if (!file.type.startsWith('image/')) {
        alert(`Please upload an ${fileType} image file`);
        return;
    }
    
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file); // Pass to parent
  };

  // Clear the selected file
  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Trigger hidden input click
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const inputId = `file-input-${fileType || 'upload'}`;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      
      {/* 1. Drag & Drop Zone or Existing Image */}
      {!selectedFile && !existingImageUrl && (
        <Paper
          variant="outlined"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'grey.400',
            bgcolor: dragActive ? 'action.hover' : 'background.paper',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            }
          }}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
            aria-label={`Upload ${fileType} file`}
          />
          
          <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="text.primary">
            {/* 3. Used correctly inside JSX */}
            Drag & Drop your {fileType} image here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse
          </Typography>
          <Box component="label" htmlFor={inputId} sx={{ cursor: 'pointer' }}>
            <Button variant="contained" component="span">
              Upload File
            </Button>
          </Box>
        </Paper>
      )}

      {/* 2. Existing Image Display */}
      {!selectedFile && existingImageUrl && (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1">Current {fileType}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" component="span" onClick={onButtonClick}>
                Replace
              </Button>
              <IconButton onClick={handleRemove} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            component="img"
            src={getFullImageUrl(existingImageUrl)}
            alt="Current"
            sx={{
              width: '100%',
              maxHeight: 350,
              borderRadius: 1,
              objectFit: 'contain',
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          />
        </Paper>
      )}

      {/* 3. File Preview State */}
      {selectedFile && previewUrl && (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" noWrap sx={{ maxWidth: 200 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <IconButton onClick={handleRemove} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              width: '100%',
              maxHeight: 350,
              borderRadius: 1,
              objectFit: 'contain',
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;