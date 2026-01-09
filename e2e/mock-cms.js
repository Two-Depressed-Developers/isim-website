const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`[MockCMS] ${req.method} ${req.url}`);

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') {
    if (req.url.includes('/api/auth/session')) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(null));
        return;
    }

    if (req.url.includes('/api/auth/csrf')) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ csrfToken: 'mock-csrf-token' }));
        return;
    }

    if (req.url.includes('/uploads/') || req.url.endsWith('.png') || req.url.endsWith('.jpg')) {
        res.setHeader('Content-Type', 'image/png');
        const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        res.statusCode = 200;
        res.end(png);
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    const url = new URL(req.url, 'http://localhost');
    const locale = url.searchParams.get('locale') || 'pl';

    let responseData = {
      id: 1,
      documentId: 'doc_1',
      title: locale === 'pl' ? 'Strona makiety' : 'Mock Page',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (req.url.includes('/api/pages')) {
        responseData = [
            { id: 1, documentId: 'doc_p1', title: locale === 'pl' ? 'Przykładowa strona' : 'Example Page', slug: 'mock-page' }
        ];
    }
    
    if (req.url.includes('/api/homepage')) {
         responseData = {
            id: 1,
            documentId: 'doc_h1',
            title: locale === 'pl' ? 'Witryna ISIM' : 'ISIM Website',
            sections: [
              { id: 1, __component: 'homepage.hero-slider', images: [] },
              { id: 2, __component: 'homepage.supervisors', title: locale === 'pl' ? 'Nasi Opiekunowie' : 'Our Supervisors', members: [] }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
         };
    }

    if (req.url.includes('/api/groups')) {
        responseData = [
            {
                id: 1,
                documentId: 'group_1',
                name: locale === 'pl' ? 'Zespół Badawczy' : 'Research Team',
                members: [
                    { id: 101, fullName: 'Jan Kowalski', position: 'Profesor', photo: { url: '/uploads/placeholder.png' } }
                ],
                supervisor: { id: 101, fullName: 'Jan Kowalski', position: 'Profesor' }
            }
        ];
    }

    if (req.url.includes('/api/staff')) {
        responseData = [
            { id: 1, documentId: 'doc_s1', name: 'Jan Kowalski', position: 'Profesor', photo: { url: '/uploads/placeholder.png' } }
        ];
    }

    if (req.url.includes('/api/global-page')) {
        responseData = {
            header: {
                logo: { image: { url: '/uploads/logo.png' }, link: { URL: `/${locale}` } },
                links: [
                    { id: 1, label: locale === 'pl' ? 'Kadra' : 'Staff', URL: `/${locale}/staff`, subLinks: [] }
                ]
            },
            footer: {
                universityLogo: { image: { url: '/uploads/uni.png' }, link: { URL: '#' }, alt: 'Logo' },
                copyrightText: locale === 'pl' ? '© {currentYear} ISIM' : '© {currentYear} ISIM English',
                sections: []
            }
        };
    }

    const response = {
      data: responseData,
      meta: {},
    };

    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({}));
  }
});

const PORT = 1337;
server.listen(PORT, () => {
  console.log(`Mock CMS running at http://localhost:${PORT}`);
});
