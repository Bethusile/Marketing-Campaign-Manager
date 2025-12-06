<<<<<<< HEAD
// Created by Bethusile Mafumana : 
import React, { useMemo, useState } from 'react';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';

import CampaignCard from '../components/CampaignCard';
import CampaignDetailModal from '../components/CampaignDetailModal';
import CampaignControls from '../components/CampaignControls';
import NavBar from '../components/NavBar';

import type { Campaign } from '../data/campaigns';
import { campaignsData } from '../data/campaigns';

const Dashboard: React.FC = () => {
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
      .filter((c) =>
        import React, { useMemo, useState } from 'react';
        import { Container, Grid } from '@mui/material';

        import CampaignCard from '../components/CampaignCard';
        import CampaignDetailModal from '../components/CampaignDetailModal';
        import CampaignControls from '../components/CampaignControls';
        import NavBar from '../components/NavBar';

        import type { Campaign } from '../data/campaigns';
        import { campaignsData } from '../data/campaigns';

        const Dashboard: React.FC = () => {
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
              <NavBar onUploadClick={() => console.log('Upload modal')} />

              <Container maxWidth={false} sx={{ width: '95%', mt: 4, mx: 'auto' }}>
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
