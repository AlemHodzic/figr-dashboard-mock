import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KpiCard } from '../KpiCard';

describe('KpiCard', () => {
  it('renders title and value', () => {
    render(<KpiCard title="Total Users" value={1234} />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<KpiCard title="Total Users" value={100} subtitle="Active this month" />);
    
    expect(screen.getByText('Active this month')).toBeInTheDocument();
  });

  it('renders loading skeleton when loading is true', () => {
    const { container } = render(<KpiCard title="Loading" value={0} loading />);
    
    // Should have skeleton elements
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Should not show actual content
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('renders positive trend with up arrow', () => {
    render(<KpiCard title="Revenue" value="$1000" trend={15} trendLabel="vs last month" />);
    
    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders negative trend with down arrow', () => {
    render(<KpiCard title="Errors" value={5} trend={-20} />);
    
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <span data-testid="test-icon">📊</span>;
    render(<KpiCard title="Stats" value={42} icon={<TestIcon />} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies status colors correctly', () => {
    render(<KpiCard title="Health" value="98%" status="good" />);
    
    // Should have green color class
    const valueElement = screen.getByText('98%');
    expect(valueElement).toHaveClass('text-emerald-600');
  });

  it('applies warning status colors', () => {
    render(<KpiCard title="Score" value="65%" status="warning" />);
    
    const valueElement = screen.getByText('65%');
    expect(valueElement).toHaveClass('text-amber-600');
  });

  it('applies bad status colors', () => {
    render(<KpiCard title="Score" value="30%" status="bad" />);
    
    const valueElement = screen.getByText('30%');
    expect(valueElement).toHaveClass('text-red-600');
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<KpiCard title="Metric" value={100} tooltip="This explains the metric" />);
    
    // Find the help icon
    const helpIcon = document.querySelector('[class*="cursor-help"]');
    expect(helpIcon).toBeInTheDocument();
    
    // Hover to show tooltip
    if (helpIcon) {
      await user.hover(helpIcon);
    }
    
    expect(screen.getByText('This explains the metric')).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(<KpiCard title="Latency" value="2.5s" />);
    
    expect(screen.getByText('2.5s')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    render(<KpiCard title="Errors" value={0} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
