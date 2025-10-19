'use client';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
