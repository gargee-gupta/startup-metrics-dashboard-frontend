import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, CheckCircle, Target, Zap } from 'lucide-react';
import { generateInsights, formatCurrency } from '@/utils/metrics';

const Insights = ({ metrics, data }) => {
  const insights = generateInsights(metrics);
  const ltvCacRatio = metrics.cac > 0 ? metrics.ltv / metrics.cac : 0;
  
  const getHealthScore = () => {
    let score = 0;
    if (ltvCacRatio >= 5) score += 40;
    else if (ltvCacRatio >= 3) score += 30;
    else if (ltvCacRatio >= 1) score += 15;

    if (metrics.churnRate <= 5) score += 30;
    else if (metrics.churnRate <= 10) score += 20;
    else if (metrics.churnRate <= 15) score += 10;

    if (metrics.arr >= 100000) score += 30;
    else if (metrics.arr >= 50000) score += 20;
    else if (metrics.arr >= 20000) score += 15;
    else if (metrics.arr >= 10000) score += 10;
    
    return Math.min(score, 100);
  };

  const healthScore = getHealthScore();

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  const recommendations = [
    {
      category: 'Customer Acquisition',
      priority: ltvCacRatio < 3 ? 'high' : 'medium',
      title: 'Optimize CAC Efficiency',
      description: `Your current CAC is ${formatCurrency(metrics.cac)}. ${
        ltvCacRatio < 3 
          ? 'Focus on reducing acquisition costs or increasing customer value.' 
          : 'Continue monitoring and optimizing your acquisition channels.'
      }`,
      icon: Target
    },
    {
      category: 'Retention',
      priority: metrics.churnRate > 10 ? 'high' : 'low',
      title: 'Improve Customer Retention',
      description: `With a ${metrics.churnRate.toFixed(1)}% churn rate, ${
        metrics.churnRate > 10 
          ? 'immediate action is needed to improve retention.' 
          : 'you have good retention, but there\'s always room for improvement.'
      }`,
      icon: CheckCircle
    },
    {
      category: 'Growth',
      priority: metrics.arr < 50000 ? 'high' : 'medium',
      title: 'Scale Revenue Growth',
      description: `Current ARR of ${formatCurrency(metrics.arr)} ${
        metrics.arr < 50000 
          ? 'indicates opportunity for aggressive growth initiatives.' 
          : 'shows strong foundation for continued scaling.'
      }`,
      icon: TrendingUp
    },
    {
      category: 'Efficiency',
      priority: 'medium',
      title: 'Monitor Unit Economics',
      description: `Keep tracking your LTV:CAC ratio of ${ltvCacRatio.toFixed(1)}:1 to ensure sustainable growth economics.`,
      icon: Zap
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Business Insights</h2>
        <p className="text-lg text-muted-foreground">
          AI-powered analysis of your startup metrics
        </p>
      </div>

      {/* Health Score */}
      <Card className="p-6 bg-gradient-card text-center">
        <div className="flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-primary mr-3" />
          <h3 className="text-2xl font-bold gradient-text">Startup Health Score</h3>
        </div>
        <div className="mb-4">
          <div className={`text-6xl font-bold ${
            healthScore >= 80 ? 'text-success' : 
            healthScore >= 60 ? 'text-warning' : 
            'text-destructive'
          }`}>
            {healthScore}
          </div>
          <div className="text-2xl font-semibold text-muted-foreground">/ 100</div>
        </div>
        <Badge 
          variant={getScoreColor(healthScore) === 'success' ? 'default' : 'destructive'}
          className="text-lg px-4 py-2"
        >
          {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
        </Badge>
      </Card>

      {/* Auto-Generated Insights */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold gradient-text">Key Insights</h3>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className="p-4 bg-gradient-card border-l-4 border-l-primary">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground leading-relaxed">{insight}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold gradient-text">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => {
            const IconComponent = rec.icon;
            return (
              <Card key={index} className="p-6 bg-gradient-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {rec.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                </div>
                
                <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{rec.category}</p>
                <p className="text-sm text-foreground leading-relaxed">{rec.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Summary */}
      <Card className="p-6 bg-gradient-card">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Metrics Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{ltvCacRatio.toFixed(1)}:1</p>
            <p className="text-sm text-muted-foreground">LTV:CAC Ratio</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{metrics.churnRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Monthly Churn</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.arr / 1000)}K</p>
            <p className="text-sm text-muted-foreground">ARR</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {metrics.mrr > 0 && metrics.burnRate > 0 ? Math.round(metrics.mrr / metrics.burnRate) : '∞'}
            </p>
            <p className="text-sm text-muted-foreground">Runway (Months)</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Insights;
