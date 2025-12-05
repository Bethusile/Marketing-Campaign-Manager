import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// 1. Update Interface to include fileType
interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  fileType?: string; // Made optional, using lowercase 'string'
}

// 2. Destructure fileType from the props object, set a default value
const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileType = "Image/Doc", ...props }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
      
      {/* 1. Drag & Drop Zone */}
      {!selectedFile && (
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
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          
          <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="text.primary">
            {/* 3. Used correctly inside JSX */}
            Drag & Drop your {fileType} image here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse
          </Typography>
          <Button variant="contained" component="span">
            Upload File
          </Button>
        </Paper>
      )}

      {/* 2. File Preview State */}
      {selectedFile && previewUrl && (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={previewUrl}
              alt="Preview"
              sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
            />
            <Box>
                <Typography variant="subtitle1" noWrap sx={{ maxWidth: 200 }}>
                    {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleRemove} color="error">
            <DeleteIcon />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;