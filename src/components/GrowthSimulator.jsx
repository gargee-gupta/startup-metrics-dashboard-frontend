import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/MetricCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, Target, Zap } from 'lucide-react';
import { calculateMetrics, formatCurrency } from '@/utils/metrics';
import { useMemo } from 'react';

export const GrowthSimulator = ({ initialData }) => {
  const [simulatorData, setSimulatorData] = useState(initialData);
  const [projectionData, setProjectionData] = useState([]);

  const metrics = useMemo(() => calculateMetrics(simulatorData), [simulatorData]);

  useEffect(() => {
    if (initialData) {
      setSimulatorData({
        users: initialData.users || 0,
        revenue: initialData.revenue || 0,
        churnRate: initialData.churnRate || 0,
        marketingSpend: initialData.marketingSpend || 0,
        ...initialData
      });
    }
  }, [initialData]);
  
  
  useEffect(() => {
    const generateProjections = () => {
      const months = [];
      let currentUsers = simulatorData.users;
      let currentMRR = simulatorData.revenue;

      for (let i = 0; i < 12; i++) {
        const monthName = new Date(2024, i).toLocaleString('default', { month: 'short' });
        const growthRate = 0.15;
        const churnEffect = simulatorData.churnRate / 100;

        currentUsers = Math.round(currentUsers * (1 + growthRate - churnEffect));
        currentMRR = Math.round(currentMRR * (1 + growthRate - churnEffect / 2));

        const monthlyMetrics = calculateMetrics({
          ...simulatorData,
          users: currentUsers,
          revenue: currentMRR,
        });

        months.push({
          month: monthName,
          users: currentUsers,
          mrr: currentMRR,
          arr: monthlyMetrics.arr,
          ltv: monthlyMetrics.ltv,
          cac: monthlyMetrics.cac,
        });
      }
      setProjectionData(months);
    };

    generateProjections();
  }, [simulatorData, metrics]);

  const handleSliderChange = (field, value) => {
    setSimulatorData((prev) => ({
      ...prev,
      [field]: value[0],
    }));
  };

  const handleInputChange = (field, value) => {
    setSimulatorData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Growth Simulator</h2>
        <p className="text-lg text-muted-foreground">
          Adjust the parameters below to see real-time impact on your metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-6 gradient-text">Adjust Parameters</h3>
          <div className="space-y-6">
            {/* Users Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="users-slider">Total Users</Label>
                <Input
                  type="number"
                  value={simulatorData.users}
                  onChange={(e) => handleInputChange('users', parseInt(e.target.value) || 0)}
                  className="w-24 h-8 text-sm"
                />
              </div>
              <Slider
                id="users-slider"
                min={100}
                max={10000}
                step={100}
                value={[simulatorData.users]}
                onValueChange={(value) => handleSliderChange('users', value)}
              />
            </div>

            {/* Revenue Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="revenue-slider">Monthly Revenue ($)</Label>
                <Input
                  type="number"
                  value={simulatorData.revenue}
                  onChange={(e) => handleInputChange('revenue', parseFloat(e.target.value) || 0)}
                  className="w-24 h-8 text-sm"
                />
              </div>
              <Slider
                id="revenue-slider"
                min={1000}
                max={100000}
                step={1000}
                value={[simulatorData.revenue]}
                onValueChange={(value) => handleSliderChange('revenue', value)}
              />
            </div>

            {/* Churn Rate Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="churn-slider">Churn Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={simulatorData.churnRate}
                  onChange={(e) => handleInputChange('churnRate', parseFloat(e.target.value) || 0)}
                  className="w-24 h-8 text-sm"
                />
              </div>
              <Slider
                id="churn-slider"
                min={0}
                max={20}
                step={0.1}
                value={[simulatorData.churnRate]}
                onValueChange={(value) => handleSliderChange('churnRate', value)}
              />
            </div>

            {/* Marketing Spend Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="marketing-slider">Marketing Spend ($)</Label>
                <Input
                  type="number"
                  value={simulatorData.marketingSpend}
                  onChange={(e) => handleInputChange('marketingSpend', parseFloat(e.target.value) || 0)}
                  className="w-24 h-8 text-sm"
                />
              </div>
              <Slider
                id="marketing-slider"
                min={1000}
                max={50000}
                step={500}
                value={[simulatorData.marketingSpend]}
                onValueChange={(value) => handleSliderChange('marketingSpend', value)}
              />
            </div>
          </div>
        </Card>

        {/* Live Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold gradient-text">Live Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="CAC" value={formatCurrency(metrics.cac)} icon={Target} />
            <MetricCard title="LTV" value={formatCurrency(metrics.ltv)} icon={TrendingUp} />
            <MetricCard title="MRR" value={formatCurrency(metrics.mrr)} icon={DollarSign} />
            <MetricCard title="ARR" value={formatCurrency(metrics.arr)} icon={Zap} />
          </div>
        </div>
      </div>

      {/* Projection Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-4">12-Month Revenue Projection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-4">User Growth Projection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--success))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
