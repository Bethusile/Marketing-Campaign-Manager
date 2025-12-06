import React, { useMemo, useState } from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CampaignCard from '../components/CampaignCard';
import CampaignDetailModal from '../components/CampaignDetailModal';
import CampaignControls from '../components/CampaignControls';
import NavBar from '../components/NavBar';

import type { Campaign } from '../data/campaigns';
import { campaignsData } from '../data/campaigns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [sortKey, setSortKey] = useState<'newest' | 'oldest' | 'alpha'>('newest');

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const filtered = useMemo(() => {
    return campaignsData
      .filter((c) => (filterStatus === 'all' ? true : c.status === filterStatus))
      .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === 'alpha') return a.title.localeCompare(b.title);

        const dateA = new Date(a.uploaded).getTime();
        const dateB = new Date(b.uploaded).getTime();

        return sortKey === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [searchTerm, sortKey, filterStatus]);

  return (
    <>
      <NavBar onUploadClick={() => navigate('/campaign')} />

      <Container maxWidth={false} sx={{ width: '95%', mt: 4, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="contained" onClick={() => navigate('/campaign')}>Create Campaign</Button>
        </Box>

        <CampaignControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortKey={sortKey}
          setSortKey={setSortKey}
        />

        <Grid container spacing={3}>
          {filtered.map((campaign) => (
            <Grid item key={campaign.id} xs={12} sm={6} md={4}>
              <CampaignCard campaign={campaign} onCardClick={openDetails} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <CampaignDetailModal
        campaign={selectedCampaign}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
