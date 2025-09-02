import React from 'react';

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-foreground">
          {value}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
