import './globals.css';

export const metadata = {
  title: 'TitikBola - Nonton Streaming Bola Gratis HD',
  description: 'Streaming pertandingan sepak bola live dengan kualitas HD tanpa buffering. 100% GRATIS, tanpa registrasi.',
  keywords: 'streaming bola, live streaming, nonton bola gratis, sepak bola live, football streaming',
  authors: [{ name: 'TitikBola' }],
  creator: 'TitikBola',
  publisher: 'TitikBola',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://titikbola.pages.dev'),
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://titikbola.pages.dev',
    siteName: 'TitikBola',
    title: 'TitikBola - Nonton Streaming Bola Gratis HD',
    description: 'Streaming pertandingan sepak bola live dengan kualitas HD tanpa buffering. 100% GRATIS.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TitikBola - Streaming Bola Gratis',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'TitikBola - Nonton Streaming Bola Gratis HD',
    description: 'Streaming pertandingan sepak bola live dengan kualitas HD tanpa buffering.',
    images: ['/images/og-image.jpg'],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add your verification codes)
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#141414" />
        
        {/* Preconnect to workers */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_WORKER_1_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_WORKER_2_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_WORKER_3_URL} />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TitikBola',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://titikbola.pages.dev',
              description: 'Streaming pertandingan sepak bola live gratis',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://titikbola.pages.dev'}?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {/* Main content */}
        {children}
        
        {/* Ad Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Monetag SmartLink
              if (${process.env.NEXT_PUBLIC_MONETAG_ENABLED === 'true'}) {
                const s = document.createElement('script');
                s.src = '//thubanoa.com/1?z=${process.env.NEXT_PUBLIC_MONETAG_ZONE_ID}';
                s.async = true;
                document.body.appendChild(s);
              }
            `,
          }}
        />
        
        {/* Analytics (if enabled) */}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Simple analytics tracking
                console.log('Analytics initialized');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}