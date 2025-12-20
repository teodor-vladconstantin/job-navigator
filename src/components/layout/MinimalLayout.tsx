import React from 'react';

const MinimalLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    {children}
  </div>
);

export default MinimalLayout;
