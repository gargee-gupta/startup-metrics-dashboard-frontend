import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export const DataInputForm = ({ data, onChange, onSubmit, disabled = false }) => {
  const handleInputChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Update Your Metrics</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Startup Name</Label>
            <Input
              id="name"
              type="text"
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your startup name"
              className="transition-all duration-200 focus:glow-effect"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="users">Total Users</Label>
            <Input
              id="users"
              type="number"
              onChange={(e) => handleInputChange('users', parseInt(e.target.value))}
              placeholder="e.g., 1000"
              className="transition-all duration-200 focus:glow-effect"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="revenue">Monthly Revenue ($)</Label>
            <Input
              id="revenue"
              type="number"
              onChange={(e) => handleInputChange('revenue', parseFloat(e.target.value))}
              placeholder="e.g., 25000"
              className="transition-all duration-200 focus:glow-effect"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="churnRate">Churn Rate (%)</Label>
            <Input
              id="churnRate"
              type="number"
              step="0.1"
              onChange={(e) => handleInputChange('churnRate', parseFloat(e.target.value))}
              placeholder="e.g., 5.2"
              className="transition-all duration-200 focus:glow-effect"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="marketingSpend">Monthly Marketing Spend ($)</Label>
            <Input
              id="marketingSpend"
              type="number"
              onChange={(e) => handleInputChange('marketingSpend', parseFloat(e.target.value))}
              placeholder="e.g., 8000"
              className="transition-all duration-200 focus:glow-effect"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={disabled}
          className="w-full bg-gradient-primary hover:glow-effect transition-all duration-300"
        >
          Update Metrics
        </Button>
      </form>
    </Card>
  );
};
