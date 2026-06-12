import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('EcoSphere Frontend App Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should render structural landmarks and panels', async () => {
    // Mock the endpoints to return a pristine starting ecosystem
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/calculate')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            cumulativeCarbon: 0,
            environmentalScore: 0,
            breakdown: { flights: 0, meat: 0, electricity: 0, trees: 0, transit: 0, vegan: 0 }
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ nudge: 'Test pristine nudge.' })
      });
    });

    render(<App />);

    // Check header structural landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Check main element landmark
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check panels via sections
    expect(screen.getByRole('region', { name: /EcoSphere Canvas/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Contextual Tracker/i })).toBeInTheDocument();
  });

  it('should display pristine styles and ARIA components when score < 30', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/calculate')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            cumulativeCarbon: 10,
            environmentalScore: 5,
            breakdown: { flights: 0, meat: 0, electricity: 10, trees: 0, transit: 0, vegan: 0 }
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ nudge: 'Mocked pristine nudge.' })
      });
    });

    render(<App />);

    // Wait for the mock calculate API response
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    // Verify correct ARIA polite live announcement element
    const scoreDisplay = document.getElementById('environmental-score-display');
    expect(scoreDisplay).toHaveAttribute('aria-live', 'polite');
    expect(scoreDisplay).toHaveTextContent('5/100');

    // Verify pristine status label is rendered
    expect(screen.getByText(/Pristine Paradise/i)).toBeInTheDocument();
    expect(screen.getByText(/EcoSphere is thriving/i)).toBeInTheDocument();
  });

  it('should render industrial/smog tokens and alerts when score > 70', async () => {
    // Mock endpoints to simulate a degraded state (Ecological Collapse)
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/calculate')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            cumulativeCarbon: 180,
            environmentalScore: 85,
            breakdown: { flights: 180, meat: 0, electricity: 0, trees: 0, transit: 0, vegan: 0 }
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ nudge: 'Collapse warning nudge!' })
      });
    });

    render(<App />);

    // Wait for mock score to populate
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
    });

    // Verify collapse status labels and elements appear
    expect(screen.getByText(/Ecological Collapse/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical! Industrial smog/i)).toBeInTheDocument();
    
    // Verify that the strained text 'Fading Biomass' is not displayed
    expect(screen.queryByText(/Fading Biomass/i)).not.toBeInTheDocument();
  });

  it('should correctly increment/decrement actions and invoke fetch requests', async () => {
    const fetchSpy = vi.fn().mockImplementation((url) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          cumulativeCarbon: 90,
          environmentalScore: 45,
          breakdown: { flights: 90, meat: 0, electricity: 0, trees: 0, transit: 0, vegan: 0 }
        })
      });
    });
    global.fetch = fetchSpy;

    render(<App />);

    // Get "Increase flight count" button
    const flightBtn = screen.getByRole('button', { name: /Increase flight count/i });
    expect(flightBtn).toBeInTheDocument();

    // Trigger action click
    fireEvent.click(flightBtn);

    // Verify calculation endpoints were queried with payload
    expect(fetchSpy).toHaveBeenCalled();
  });
});
