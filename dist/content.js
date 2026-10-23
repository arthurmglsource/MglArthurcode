/* Substituir contactos e conceitos pelos dados reais e voltar a publicar. */
// Google Calendar appointment schedule: 30 minutes, Google Meet.
// In Google's booking form, add Company and WhatsApp alongside name/email.
// Only this setting needs changing to activate all meeting actions.
const GOOGLE_BOOKING_URL = "https://calendar.app.google/1CnJ6tHeD56DbUkd8";
const WHATSAPP_URL = "https://wa.me/351929222317?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20entender%20melhor%20como%20voc%C3%AA%20podem%20ajudar%20o%20meu%20neg%C3%B3cio%20";
window.MGL_CONTENT={
 instagramUrl:'https://www.instagram.com/mglgrowth/',
 whatsappNumber:'351929222317',
 whatsappMessage:'Olá! Vim pelo site e gostaria de entender melhor como você podem ajudar o meu negócio ',
 whatsappUrl:WHATSAPP_URL,
 meetingUrl:GOOGLE_BOOKING_URL,
 prices:{PT:'€89',BR:'R$497'},
 projects:[
  {
    "image": "assets/portfolio/vintage-hero-update-1280.webp",
    "imageHeight": 672,
    "label": "Hero",
    "id": "vintage-culture",
    "title": "Vintage Culture",
    "category": "CONCEPT WEBSITE",
    "concept": true,
    "screens": [
      {
        "image": "assets/portfolio/vintage-collage-update-1280.webp",
        "imageHeight": 662,
        "label": "Collage / timeline",
        "offset": [
          -110,
          -190
        ],
        "tileWidth": 200
      },
      {
        "image": "assets/portfolio/vintage-editorial-update-1280.webp",
        "imageHeight": 660,
        "label": "Composição editorial",
        "offset": [
          240,
          -145
        ],
        "tileWidth": 220
      }
    ],
    "position": [
      610,
      380
    ],
    "tileWidth": 420
  },
  {
    "image": "assets/portfolio/guarana-hero-update-1280.webp",
    "imageHeight": 661,
    "label": "Original do Brasil",
    "id": "guarana-antarctica",
    "title": "Guaraná Antarctica",
    "category": "DIGITAL EXPERIENCE",
    "screens": [
      {
        "image": "assets/portfolio/guarana-original-zero-update-1280.webp",
        "imageHeight": 658,
        "label": "Original ou Zero",
        "offset": [
          320,
          -160
        ],
        "tileWidth": 195
      },
      {
        "image": "assets/portfolio/guarana-products-update-1280.webp",
        "imageHeight": 662,
        "label": "Nossos produtos",
        "offset": [
          210,
          245
        ],
        "tileWidth": 220
      }
    ],
    "position": [
      1530,
      400
    ],
    "tileWidth": 410
  },
  {
    "id": "vinicius-figueiredo",
    "title": "Vinicius Figueiredo",
    "category": "WEBSITE",
    "image": "assets/portfolio/vinicius-new-hero-update-1280.webp",
    "concept": false,
    "position": [
      510,
      890
    ],
    "tileWidth": 380,
    "imageHeight": 659,
    "screens": [
      {
        "image": "assets/portfolio/vinicius-01-hero.webp",
        "imageHeight": 677,
        "label": "Identidade e estratégia",
        "offset": [
          -240,
          -70
        ],
        "tileWidth": 220
      },
      {
        "image": "assets/portfolio/vinicius-02-especialidades-story-1280.webp",
        "imageHeight": 679,
        "tileWidth": 205,
        "label": "Serviços e especialidades",
        "offset": [
          40,
          235
        ]
      },
      {
        "image": "assets/portfolio/vinicius-03-metodo-story-1280.webp",
        "imageHeight": 674,
        "tileWidth": 180,
        "label": "Método e processo",
        "offset": [
          260,
          205
        ]
      }
    ],
    "label": "Hero"
  },
  {
    "image": "assets/portfolio/im-beauty-hero-update-1280.webp",
    "imageHeight": 664,
    "label": "Fundadores",
    "id": "im-beauty",
    "title": "IM Beauty Center",
    "category": "WEBSITE",
    "screens": [
      {
        "image": "assets/portfolio/im-beauty-team-update-1280.webp",
        "imageHeight": 658,
        "label": "Equipa e contacto",
        "offset": [
          420,
          60
        ],
        "tileWidth": 235
      }
    ],
    "position": [
      1510,
      900
    ],
    "tileWidth": 410
  },
  {
    "id": "malu-criare",
    "title": "Malu Criare",
    "category": "WEBSITE",
    "image": "assets/portfolio/malu-01-hero.webp",
    "concept": false,
    "position": [
      1110,
      270
    ],
    "tileWidth": 355,
    "imageHeight": 672,
    "screens": [
      {
        "image": "assets/portfolio/malu-02-concept-criativo-story-1280.webp",
        "imageHeight": 672,
        "tileWidth": 190,
        "label": "Direção criativa",
        "offset": [
          -170,
          -190
        ]
      },
      {
        "image": "assets/portfolio/malu-03-cta-footer-story-1280.webp",
        "imageHeight": 675,
        "tileWidth": 185,
        "label": "CTA e footer",
        "offset": [
          390,
          -105
        ]
      }
    ]
  },
  {
    "id": "madeireira-hr",
    "title": "Madeireira HR",
    "category": "WEBSITE",
    "image": "assets/portfolio/madeireira-hr-02-hero-arquitetura.webp",
    "concept": false,
    "position": [
      2070,
      570
    ],
    "tileWidth": 300,
    "imageHeight": 672,
    "screens": [
      {
        "image": "assets/portfolio/madeireira-hr-01-hero-equipe-story-1280.webp",
        "imageHeight": 668,
        "tileWidth": 170,
        "label": "Equipa e empresa",
        "offset": [
          -100,
          -130
        ]
      },
      {
        "image": "assets/portfolio/madeireira-products-update-1280.webp",
        "imageHeight": 665,
        "label": "Madeiras e produtos",
        "offset": [
          -40,
          205
        ],
        "tileWidth": 205
      }
    ]
  },
  {
    "id": "super-bock",
    "title": "Super Bock",
    "category": "CONCEPT PROJECT",
    "image": "assets/portfolio/super-bock-01-hero-concept.webp",
    "concept": true,
    "position": [
      1120,
      1130
    ],
    "tileWidth": 355,
    "imageHeight": 676,
    "screens": [
      {
        "image": "assets/portfolio/super-bock-product-update-1280.webp",
        "imageHeight": 658,
        "label": "Produto",
        "offset": [
          380,
          20
        ],
        "tileWidth": 200
      },
      {
        "image": "assets/portfolio/super-bock-02-footer-concept-story-1280.webp",
        "imageHeight": 672,
        "tileWidth": 200,
        "label": "Footer — CONCEPT PROJECT",
        "offset": [
          130,
          215
        ]
      }
    ]
  },
  {
    "id": "jonaas",
    "title": "Jonaas",
    "category": "ARTIST WEBSITE",
    "image": "assets/portfolio/jonaas-01-hero.webp",
    "concept": false,
    "position": [
      40,
      440
    ],
    "tileWidth": 310,
    "imageHeight": 676,
    "screens": [
      {
        "image": "assets/portfolio/jonaas-02-musica-player-story-1280.webp",
        "imageHeight": 667,
        "tileWidth": 185,
        "label": "Música e player",
        "offset": [
          80,
          210
        ]
      },
      {
        "image": "assets/portfolio/jonaas-03-editorial-pb-story-1280.webp",
        "imageHeight": 667,
        "tileWidth": 165,
        "label": "Editorial P&B",
        "offset": [
          -10,
          350
        ]
      }
    ]
  },
  {
    "image": "assets/portfolio/depra-hero-update-1280.webp",
    "imageHeight": 665,
    "label": "Hero",
    "id": "depra",
    "title": "Deprá Barber Club",
    "category": "WEBSITE",
    "screens": [
      {
        "image": "assets/portfolio/depra-gallery-update-1280.webp",
        "imageHeight": 648,
        "label": "Galeria",
        "offset": [
          350,
          -5
        ],
        "tileWidth": 200
      },
      {
        "image": "assets/portfolio/depra-app-update-1280.webp",
        "imageHeight": 549,
        "label": "App e agendamento",
        "offset": [
          180,
          180
        ],
        "tileWidth": 220
      }
    ],
    "position": [
      60,
      65
    ],
    "tileWidth": 330
  },
  {
    "id": "organiza-pj",
    "title": "Organiza PJ",
    "category": "WEBSITE",
    "image": "assets/portfolio/organiza-pj-01-hero.webp",
    "concept": false,
    "position": [
      560,
      1280
    ],
    "tileWidth": 320,
    "imageHeight": 672,
    "screens": [
      {
        "image": "assets/portfolio/organiza-dashboard-update-1280.webp",
        "imageHeight": 660,
        "label": "Seu negócio na palma da sua mão",
        "offset": [
          -250,
          5
        ],
        "tileWidth": 205
      }
    ]
  },
  {
    "image": "assets/portfolio/odonto-results-update-1280.webp",
    "imageHeight": 659,
    "label": "Resultados em destaque",
    "id": "odonto",
    "title": "Clínica Odontológica",
    "category": "WEBSITE",
    "screens": [
      {
        "image": "assets/portfolio/odonto-before-after-update-1280.webp",
        "imageHeight": 660,
        "label": "Antes e depois",
        "offset": [
          -240,
          165
        ],
        "tileWidth": 200
      }
    ],
    "position": [
      2020,
      1230
    ],
    "tileWidth": 310
  }
]
};
