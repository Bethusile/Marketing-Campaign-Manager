import React, { useMemo, useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ImageCard from '../components/ImageCard';
import ImageDetailModal from '../components/ImageDetailModal';
import CampaignControls from '../components/CampaignControls';
import NavBar from '../components/NavBar';
import Alert from '../components/Alert'; 

import type { CampaignImage } from '../api/campaign';
import { getAllImages } from '../api/campaign';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'newest' | 'oldest' | 'alpha'>('newest');

  const [campaigns, setCampaigns] = useState<CampaignImage[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. ADD STATE FOR ALERT MANAGEMENT
  const [alertState, setAlertState] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'warning';
  }>({
    open: false,
    title: '',
    message: '',
    type: 'error',
  });

  const openDetails = (campaign: CampaignImage) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const filtered = useMemo(() => {
    return campaigns
      .filter((c) => (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === 'alpha') return (a.title || '').localeCompare(b.title || '');

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortKey === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [searchTerm, sortKey, campaigns]);

  // 2. UPDATE useEffect TO HANDLE THE API ERROR
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getAllImages();
        if (!mounted) return;

        setCampaigns(res);
        setAlertState(prev => ({ ...prev, open: false }));

      } catch (err) {
        console.error('Failed to fetch campaign images:', err);
        if (!mounted) return;

        setAlertState({
          open: true,
          title: 'Error: Failed to fetch images',
          message: 'Could not connect to the server. Please check your network connection and try again.',
          type: 'error',
        });
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAlertClose = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <NavBar />

      <Container maxWidth={false} sx={{ mt: 4, px: 2 }}>
        <CampaignControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortKey={sortKey}
          setSortKey={setSortKey}
          onUploadClick={() => navigate('/images/new')}
          onAddCampaignClick={() => navigate('/campaigns/new')}
        />

        <Box
          component="section"
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            alignItems: 'stretch'
          }}
        >
          {filtered.map((campaign) => (
            <Box key={campaign.id} sx={{ width: '100%' }}>
              <ImageCard image={campaign} onCardClick={openDetails} />
            </Box>
          ))}
        </Box>
      </Container>

      <ImageDetailModal
        image={selectedCampaign}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 3. RENDER THE ALERT COMPONENT */}
      <Alert
        open={alertState.open}
        onClose={handleAlertClose}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />
    </>
  );
};

export default Dashboard;