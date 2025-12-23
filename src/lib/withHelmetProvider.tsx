import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

export function withHelmetProvider(Component: React.ComponentType<any>) {
  return function HelmetWrapped(props: any) {
    return (
      <HelmetProvider>
        <Component {...props} />
      </HelmetProvider>
    );
  };
}
