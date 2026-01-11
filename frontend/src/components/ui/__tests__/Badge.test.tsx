import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>New Feature</Badge>);
    
    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Badge>Default</Badge>);
    
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-primary');
  });

  it('applies secondary variant styles', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    
    const badge = screen.getByText('Secondary');
    expect(badge).toHaveClass('bg-secondary');
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-emerald-100');
    expect(badge).toHaveClass('text-emerald-800');
  });

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>);
    
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-amber-100');
    expect(badge).toHaveClass('text-amber-800');
  });

  it('applies error variant styles', () => {
    render(<Badge variant="error">Error</Badge>);
    
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  it('applies outline variant styles', () => {
    render(<Badge variant="outline">Outline</Badge>);
    
    const badge = screen.getByText('Outline');
    expect(badge).toHaveClass('border');
  });

  it('allows custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Badge data-testid="badge-test">Test</Badge>);
    
    expect(screen.getByTestId('badge-test')).toBeInTheDocument();
  });
});
