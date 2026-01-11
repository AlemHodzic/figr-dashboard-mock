import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  it('renders default error message', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(<ErrorState message="Network connection failed" />);
    
    expect(screen.getByText('Network connection failed')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    
    await user.click(screen.getByRole('button', { name: /try again/i }));
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders error icon', () => {
    const { container } = render(<ErrorState />);
    
    // Check for the error icon wrapper
    const iconWrapper = container.querySelector('.bg-red-100');
    expect(iconWrapper).toBeInTheDocument();
  });
});
