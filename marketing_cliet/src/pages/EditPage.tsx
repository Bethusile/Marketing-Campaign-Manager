import React from 'react';
import { Container } from '@mui/material';
// Ensure this path points to where you saved the NavBar file
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Dropdown from '../components/CustomDropdown'; 
import '../styles.css'; // Imports should be at the top

const Campaign: React.FC = () => {
  return (
    <>
      <NavBar />
      <Container>
        <Dropdown label={'Status'} value={''} options={[{ value: 'active', label: 'Active' },{ value: 'inactive', label: 'Inactive' }]} onChange={function (): void {
          throw new Error('Function not implemented.');
        } } />
        <Input label="Title" />
        <Input label="Message" />
        <Input label="URL" />
      </Container>
      <Container className="campaignUpload">
        <UploadFile onFileSelect={function (): void {
          throw new Error('Function not implemented.');
        } } fileType='redacted'/><UploadFile onFileSelect={function (): void {
          throw new Error('Function not implemented.');
        } } fileType='unredacted'/>
      </Container>
      <Container>
        <Input label="Comment" />
      </Container>
      <Container>
        <Button label="Save" />
      </Container>
      
    </>
  );
};

export default Campaign;