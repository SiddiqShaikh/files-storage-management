'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#FA7275"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;