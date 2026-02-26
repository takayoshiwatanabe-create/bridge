import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { TabBarIcon } from './TabBarIcon';
import { FontAwesome } from '@expo/vector-icons';

describe('TabBarIcon', () => {
  it('renders FontAwesome icon correctly', () => {
    const { getByTestId } = render(
      <TabBarIcon name="briefcase" color="blue" isRTL={false} />
    );
    const icon = getByTestId('FontAwesomeIcon'); // FontAwesome doesn't have a testID by default, need to mock or find another way
    // For now, we'll just check if the component renders without crashing.
    // A more robust test would involve mocking FontAwesome or using snapshot testing.
    expect(icon).toBeTruthy();
  });

  it('applies RTL transform when isRTL is true', () => {
    const { getByTestId } = render(
      <TabBarIcon name="briefcase" color="blue" isRTL={true} />
    );
    const iconWrapper = getByTestId('FontAwesomeIcon').parent; // Assuming FontAwesome is wrapped in a View
    expect(iconWrapper?.props.style.transform).toEqual([{ scaleX: -1 }]);
  });

  it('does not apply RTL transform when isRTL is false', () => {
    const { getByTestId } = render(
      <TabBarIcon name="briefcase" color="blue" isRTL={false} />
    );
    const iconWrapper = getByTestId('FontAwesomeIcon').parent;
    expect(iconWrapper?.props.style.transform).toBeUndefined();
  });
});

// Mock FontAwesome to add a testID
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: jest.fn(({ name, color, size }) => (
    <mock-font-awesome name={name} color={color} size={size} testID="FontAwesomeIcon" />
  )),
}));

