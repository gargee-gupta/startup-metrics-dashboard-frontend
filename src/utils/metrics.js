export const calculateMetrics = (data) => {
  const { users, revenue, churnRate, marketingSpend, name } = data;
  
  const cac = users > 0 ? marketingSpend / users : 0;
  const mrr = revenue;
  const arr = mrr * 12;
  const arpu = users > 0 ? mrr / users : 0;
  const churnDecimal = churnRate / 100;
  const ltv = churnDecimal > 0 ? arpu / churnDecimal : arpu * 12;
  const burnRate = marketingSpend;
  
  return {
    name,
    users,
    revenue,
    churnRate,
    marketingSpend,
    cac: Math.round(cac * 100) / 100,
    ltv: Math.round(ltv * 100) / 100,
    mrr: Math.round(mrr * 100) / 100,
    arr: Math.round(arr * 100) / 100,
    burnRate: Math.round(burnRate * 100) / 100
  };
};

export const generateInsights = (metrics) => {
  const insights = [];
  const ltvCacRatio = metrics.ltv / metrics.cac;

  if (ltvCacRatio < 3) {
    insights.push("Your LTV:CAC ratio is below 3:1. Consider optimizing acquisition costs or increasing customer value.");
  } else if (ltvCacRatio > 5) {
    insights.push("Excellent LTV:CAC ratio! You're efficiently converting marketing spend into customer value.");
  }

  if (metrics.churnRate > 10) {
    insights.push(" High churn rate detected. Focus on customer retention and product-market fit.");
  } else if (metrics.churnRate < 5) {
    insights.push("Great customer retention! Your low churn rate indicates strong product-market fit.");
  }

  if (metrics.arr > 100000) {
    insights.push("Strong ARR foundation! You're well-positioned for scaling operations.");
  }

  const monthsRunway = metrics.mrr > 0 ? (metrics.mrr / metrics.burnRate) : 0;
  if (monthsRunway < 6 && monthsRunway > 0) {
    insights.push("Limited runway detected. Consider fundraising or reducing burn rate.");
  }

  if (insights.length === 0) {
    insights.push("Your metrics look balanced. Keep monitoring trends and optimizing for growth!");
  }

  return insights;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value) => {
  const num = Number(value) || 0; // ensures it's a number
  return `${num.toFixed(1)}%`;
};


export const generateDashboardChartData = (currentData, currentMetrics) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, i) => {
    const progress = (i + 1) / 6;
    const growthFactor = 1 / (1 + Math.exp(-3 * (progress - 0.5))) * progress;

    return {
      month,
      mrr: Math.round(currentMetrics.mrr * 0.15 + (currentMetrics.mrr * 0.85 * growthFactor)),
      users: Math.round(currentData.users * 0.1 + (currentData.users * 0.9 * growthFactor)),
      churn: Math.round((currentMetrics.churnRate + (5 - currentMetrics.churnRate) * (1 - progress)) * 10) / 10
    };
  });
};

export const generatePieChartData = (metrics) => {
  const churnedPercent = Math.min(Math.max(metrics.churnRate, 0), 100);
  const returningPercent = Math.min(Math.max(metrics.users * 0.3, 0), 100 - churnedPercent); 
  const newPercent = 100 - churnedPercent - returningPercent;

  return [
    { name: 'New Users', value: Math.round(newPercent), color: 'hsl(var(--primary))' },
    { name: 'Returning', value: Math.round(returningPercent), color: 'hsl(var(--success))' },
    { name: 'Churned', value: Math.round(churnedPercent), color: 'hsl(var(--destructive))' }
  ];
};
