import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  Zap
} from 'lucide-react';
import {
  formatCurrency,
  formatPercentage,
  generateDashboardChartData,
  generatePieChartData
} from '@/utils/metrics';
import { useMemo } from 'react';


export const Dashboard = ({ metrics, startupName}) => {
  const chartData = useMemo(
    () => generateDashboardChartData(metrics, metrics),
    [metrics.revenue, metrics.users, metrics.churnRate] // track only actual metric values
  );

  const pieData = generatePieChartData(metrics, metrics.churnRate);
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-lg text-muted-foreground">
          Let's see how{' '}
          <span className="font-semibold text-foreground">
            {startupName || 'your startup'}
          </span>{' '}
          is performing
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Customer Acquisition Cost"
          value={formatCurrency(metrics.cac)}
          icon={Target}
          description="Cost to acquire each customer"
          change="-12%"
          changeType="positive"
        />
        <MetricCard
          title="Customer Lifetime Value"
          value={formatCurrency(metrics.ltv)}
          icon={TrendingUp}
          description="Total value per customer"
          change="+18%"
          changeType="positive"
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(metrics.mrr)}
          icon={DollarSign}
          description="Predictable monthly income"
          change="+24%"
          changeType="positive"
        />
        <MetricCard
          title="Annual Recurring Revenue"
          value={formatCurrency(metrics.arr)}
          icon={Zap}
          description="Projected yearly revenue"
          change="+28%"
          changeType="positive"
        />
        <MetricCard
          title="Churn Rate"
          value={formatPercentage(metrics.churnRate ?? 0)}
          icon={AlertTriangle}
          description="Customer loss rate"
          change="-2.1%"
          changeType="positive"
        />
        <MetricCard
          title="Burn Rate"
          value={formatCurrency(metrics.burnRate)}
          icon={Users}
          description="Monthly spending rate"
          change="+5%"
          changeType="negative"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MRR Growth Chart */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold mb-4">MRR Growth Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Predicted monthly recurring revenue trend since last six months
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold mb-4">User Acquisition Chart</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Predicted user growth trend since last six months
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="users"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(data, index, e) => {
                    const bar = e.target;
                    const x = parseFloat(bar.getAttribute('x')) + parseFloat(bar.getAttribute('width')) / 2;
                    const y = parseFloat(bar.getAttribute('y')) + parseFloat(bar.getAttribute('height')) / 2;
                    bar.setAttribute('transform', `translate(${x} ${y}) scale(1.05 1.05) translate(${-x} ${-y})`);
                  }}
                  onMouseLeave={(data, index, e) => {
                    const bar = e.target;
                    bar.setAttribute('fill', 'hsl(var(--success))');
                    bar.setAttribute('transform', ''); // reset
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Composition Pie Chart */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold mb-4">User Composition</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Breakdown of user types by background
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key={metrics.churnRate}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: '#FF4D00' }}   
                  labelStyle={{ color: '#FF4D00' }}  
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Churn Rate Trend */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold mb-4">Churn Rate Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Possible trends over monthly churn rate
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="churn"
                  stroke="hsl(var(--warning))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
