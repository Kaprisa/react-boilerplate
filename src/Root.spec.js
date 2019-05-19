import React from 'react';
import { render } from 'react-testing-library';
import Root from './Root';

describe('Root', () => {
  it('Renders without error', () => {
    render(<Root />);
  });
});
