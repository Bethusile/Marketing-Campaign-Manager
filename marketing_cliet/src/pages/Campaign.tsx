import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
// Ensure this path points to where you saved the NavBar file
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Dropdown from '../components/CustomDropdown';
import redirectTo from '../utils/redirect';
import '../styles.css'; // Imports should be at the top

const Campaign: React.FC = () => {
  const statusOptions = [
    { value: 'active', label: 'Active' },      // <--- Matches this one
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];
  const [status, setStatus] = useState('pending');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };

  return (
    <>
      <NavBar />
      <Container className='header'>
        <Typography variant="h5" component="section" gutterBottom>
                    Compaign
                  </Typography>
      </Container>
      <Container>
        <Dropdown label={'Status'} value={status} options={statusOptions} onChange={handleChange} />
        <Input label="Title" required={true}/>
        <Input label="Message" required={true} multiline rows={5}/>
        <Input label="URL" required={true}/>
      </Container>
      <Container className="campaignUpload">
        <UploadFile onFileSelect={function (file: File | null): void {
          throw new Error('Function not implemented.');
        } } fileType='redacted'/><UploadFile onFileSelect={function (file: File | null): void {
          throw new Error('Function not implemented.');
        } } fileType='unredacted' />
      </Container>
      <Container>
        <Input label="Comment" />
      </Container>
      <Container>
        <Button label="Upload Campaign" onClick={() => redirectTo('kekfkre')}/>
      </Container>
      
    </>
  );
};

export default Campaign;