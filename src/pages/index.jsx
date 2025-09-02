import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { GrowthSimulator } from '@/components/GrowthSimulator';
import Insights from '@/components/Insights';
import { DataInputForm } from '@/components/DataInputForm';
import { useStartups } from '@/hooks/useStartups';
import { DEFAULT_STARTUP } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { data } from 'react-router-dom';
import { calculateMetrics } from '@/utils/metrics';

const Index = () => {
  const { startupsQuery, addStartupMutation } = useStartups();
  const { toast } = useToast();

  const [selectedStartup, setSelectedStartup] = useState(DEFAULT_STARTUP);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Update selectedStartup when backend data is fetched
  useEffect(() => {
    if (startupsQuery.data?.length > 0) {
      const latestStartup = startupsQuery.data[0];
      setSelectedStartup(calculateMetrics(latestStartup));
    } else {
      setSelectedStartup(DEFAULT_STARTUP);
    }
  }, []);
  
  

  const handleSubmit = () => {
    addStartupMutation.mutate(selectedStartup, {
        onSuccess: (res) => {
            const updatedStartup = calculateMetrics(res?.data ?? selectedStartup);
          
            // Replace the old object entirely
            setSelectedStartup(updatedStartup);
          
            toast({
              title: 'Success',
              description: `Metrics for "${updatedStartup.name}" updated successfully!`,
              variant: 'success',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to update metrics. Please try again.',
                variant: 'destructive',
            });
        }
    });
  };
  
  

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
            return (
              <>
                <DataInputForm
                  data={selectedStartup}
                  onChange={(updatedData) => {
                    setSelectedStartup(calculateMetrics(updatedData));
                  }}
                  onSubmit={handleSubmit}
                  disabled={addStartupMutation.isLoading}
                />
                <Dashboard
                  metrics={selectedStartup}
                  startupName={selectedStartup.name}
                  data={[selectedStartup]}
                />
              </>
            );
      case 'simulator':
        return <GrowthSimulator initialData={calculateMetrics(selectedStartup)} />;
      case 'insights':
        return <Insights metrics={selectedStartup} data={[selectedStartup]} />;
      default:
        return (
          <Dashboard
            metrics={selectedStartup}
            startupName={selectedStartup.name}
            data={[selectedStartup]}
          />
        );
    }
  };

  if (startupsQuery.isLoading) return <div>Loading...</div>;
  if (startupsQuery.isError) return <div>Error loading data</div>;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-6 py-8">{renderActiveTab()}</main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
