import React, { useMemo, useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
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
      <NavBar />

      <Container maxWidth={false} sx={{ mt: 4, px: 2 }}>
        <CampaignControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortKey={sortKey}
          setSortKey={setSortKey}
          onUploadClick={() => navigate('/campaign')}
        />

        <Box
          component="section"
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            alignItems: 'stretch'
          }}
        >
          {filtered.map((campaign) => (
            <Box key={campaign.id} sx={{ width: '100%' }}>
              <CampaignCard campaign={campaign} onCardClick={openDetails} />
            </Box>
          ))}
        </Box>
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
