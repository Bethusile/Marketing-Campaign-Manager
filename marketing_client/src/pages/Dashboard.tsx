import React, { useMemo, useState, useEffect } from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CampaignCard from '../components/CampaignCard';
import CampaignDetailModal from '../components/CampaignDetailModal';
import CampaignControls from '../components/CampaignControls';
import NavBar from '../components/NavBar';

import type { Campaign as ApiCampaign } from '../api/campaign';
import { getAllCampaigns } from '../api/campaign';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [sortKey, setSortKey] = useState<'newest' | 'oldest' | 'alpha'>('newest');

  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<ApiCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (campaign: ApiCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const filtered = useMemo(() => {
    return campaigns
      .filter((c) => (filterStatus === 'all' ? true : (filterStatus === 'Active' ? c.isActive : !c.isActive)))
      .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === 'alpha') return a.title.localeCompare(b.title);

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortKey === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [searchTerm, sortKey, filterStatus, campaigns]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getAllCampaigns();
        if (!mounted) return;

        setCampaigns(res);
      } catch (err) {
        console.log(err)
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

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
            <Grid key={campaign.id} sx={{ width: { xs: '100%', sm: '50%', md: '32%' } }}>
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
