import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders default title and message', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByText('There is no data to display for the selected period.')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<EmptyState title="No recommendations" />);
    
    expect(screen.getByText('No recommendations')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<EmptyState message="Try selecting a different date range." />);
    
    expect(screen.getByText('Try selecting a different date range.')).toBeInTheDocument();
  });

  it('renders custom title and message together', () => {
    render(
      <EmptyState 
        title="Empty results" 
        message="Your search returned no matching items." 
      />
    );
    
    expect(screen.getByText('Empty results')).toBeInTheDocument();
    expect(screen.getByText('Your search returned no matching items.')).toBeInTheDocument();
  });

  it('renders inbox icon', () => {
    const { container } = render(<EmptyState />);
    
    // Check for the icon wrapper
    const iconWrapper = container.querySelector('.bg-muted');
    expect(iconWrapper).toBeInTheDocument();
  });
});
