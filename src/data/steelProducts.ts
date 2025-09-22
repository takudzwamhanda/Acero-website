export interface SteelProduct {
  id: string;
  name: string;
  image: string;
  retailPrice: string;
  wholesalePrice: string;
  specifications: string;
  category: string;
  gauge?: string;
  size?: string;
  dimensions?: string;
}

export const steelProducts: SteelProduct[] = [
  // Round Tubes - Light Gauge (1.2mm)
  {
    id: 'round-19-1.2mm',
    name: '19mm Round Tube',
    image: '/src/images/Round Tubes 19mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$8.50/ft',
    wholesalePrice: '$6.80/ft',
    specifications: '19mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '19mm'
  },
  {
    id: 'round-25-1.2mm',
    name: '25mm Round Tube',
    image: '/src/images/Round Tubes 25mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$10.25/ft',
    wholesalePrice: '$8.20/ft',
    specifications: '25mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '25mm'
  },
  {
    id: 'round-32-1.2mm',
    name: '32mm Round Tube',
    image: '/src/images/Round Tubes 32mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$12.75/ft',
    wholesalePrice: '$10.20/ft',
    specifications: '32mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '32mm'
  },
  {
    id: 'round-38-1.2mm',
    name: '38mm Round Tube',
    image: '/src/images/Round Tubes 38mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$14.50/ft',
    wholesalePrice: '$11.60/ft',
    specifications: '38mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '38mm'
  },
  {
    id: 'round-50-1.2mm',
    name: '50mm Round Tube',
    image: '/src/images/Round Tubes 50mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$18.25/ft',
    wholesalePrice: '$14.60/ft',
    specifications: '50mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '50mm'
  },
  {
    id: 'round-63-1.2mm',
    name: '63mm Round Tube',
    image: '/src/images/Round Tubes 63mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$22.40/ft',
    wholesalePrice: '$17.92/ft',
    specifications: '63mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '63mm'
  },
  {
    id: 'round-76-1.2mm',
    name: '76mm Round Tube',
    image: '/src/images/Round Tubes 76mm Round Tube (1.2mm gauge).jpg',
    retailPrice: '$26.80/ft',
    wholesalePrice: '$21.44/ft',
    specifications: '76mm diameter, 1.2mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.2mm',
    size: '76mm'
  },

  // Round Tubes - Heavy Gauge (1.6mm)
  {
    id: 'round-19-1.6mm',
    name: '19mm Round Tube (Heavy)',
    image: '/src/images/Round Tubes 19mm Round Tube (1.6mm heavy gauge).jpg',
    retailPrice: '$11.25/ft',
    wholesalePrice: '$9.00/ft',
    specifications: '19mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '19mm'
  },
  {
    id: 'round-25-1.6mm',
    name: '25mm Round Tube (Heavy)',
    image: '/src/images/Round Tubes 25mm Round Tube (1.6mm heavy gauge.jpg',
    retailPrice: '$13.50/ft',
    wholesalePrice: '$10.80/ft',
    specifications: '25mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '25mm'
  },
  {
    id: 'round-32-1.6mm',
    name: '32mm Round Tube (Heavy)',
    image: '/src/images/Round Tubes 32mm Round Tube (1.6mm heavy gauge).jpg',
    retailPrice: '$16.75/ft',
    wholesalePrice: '$13.40/ft',
    specifications: '32mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '32mm'
  },
  {
    id: 'round-38-1.6mm',
    name: '38mm Round Tube (Heavy)',
    image: '/src/images/Round Tube 38mm Round Tube (1.6mm heavy gauge).jpg',
    retailPrice: '$19.25/ft',
    wholesalePrice: '$15.40/ft',
    specifications: '38mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '38mm'
  },
  {
    id: 'round-50-1.6mm',
    name: '50mm Round Tube (Heavy)',
    image: '/src/images/Round Tubes 50mm Round Tube (1.6mm heavy gauge).webp',
    retailPrice: '$24.50/ft',
    wholesalePrice: '$19.60/ft',
    specifications: '50mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '50mm'
  },
  {
    id: 'round-63-1.6mm',
    name: '63mm Round Tube (Heavy)',
    image: '/src/images/Round Tubes 63mm Round Tube (1.6mm heavy gauge).webp',
    retailPrice: '$30.25/ft',
    wholesalePrice: '$24.20/ft',
    specifications: '63mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '63mm'
  },
  {
    id: 'round-76-1.6mm',
    name: '76mm Round Tube (Heavy)',
    image: '/src/images/Round Tubes 76mm Round Tube (1.6mm heavy gauge).avif',
    retailPrice: '$36.50/ft',
    wholesalePrice: '$29.20/ft',
    specifications: '76mm diameter, 1.6mm wall thickness',
    category: 'Round Tubes',
    gauge: '1.6mm',
    size: '76mm'
  },

  // Square Tubes - Light Gauge (1.2mm)
  {
    id: 'square-15-1.2mm',
    name: '15mm Square Tube',
    image: '/src/images/Square Tubes 15mm Square Tube (1.2mm gauge).jpg',
    retailPrice: '$7.25/ft',
    wholesalePrice: '$5.80/ft',
    specifications: '15mm x 15mm, 1.2mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.2mm',
    size: '15mm',
    dimensions: '15mm x 15mm'
  },
  {
    id: 'square-20-1.2mm',
    name: '20mm Square Tube',
    image: '/src/images/Square Tubes 20mm Square Tube (1.2mm gauge).jpg',
    retailPrice: '$9.50/ft',
    wholesalePrice: '$7.60/ft',
    specifications: '20mm x 20mm, 1.2mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.2mm',
    size: '20mm',
    dimensions: '20mm x 20mm'
  },
  {
    id: 'square-30-1.2mm',
    name: '30mm Square Tube',
    image: '/src/images/Square Tubes 30mm Square Tube (1.2mm gauge).webp',
    retailPrice: '$13.75/ft',
    wholesalePrice: '$11.00/ft',
    specifications: '30mm x 30mm, 1.2mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.2mm',
    size: '30mm',
    dimensions: '30mm x 30mm'
  },
  {
    id: 'square-40-1.2mm',
    name: '40mm Square Tube',
    image: '/src/images/Square Tubes 40mm Square Tube (1.2mm gauge).jpg',
    retailPrice: '$17.25/ft',
    wholesalePrice: '$13.80/ft',
    specifications: '40mm x 40mm, 1.2mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.2mm',
    size: '40mm',
    dimensions: '40mm x 40mm'
  },
  {
    id: 'square-50-1.2mm',
    name: '50mm Square Tube',
    image: '/src/images/Square Tubes 50mm Square Tube (1.2mm gauge).jfif',
    retailPrice: '$21.50/ft',
    wholesalePrice: '$17.20/ft',
    specifications: '50mm x 50mm, 1.2mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.2mm',
    size: '50mm',
    dimensions: '50mm x 50mm'
  },

  // Square Tubes - Heavy Gauge (1.6mm)
  {
    id: 'square-15-1.6mm',
    name: '15mm Square Tube (Heavy)',
    image: '/src/images/Square Tubes 15mm Square Tube (1.6mm heavy gauge).png',
    retailPrice: '$9.75/ft',
    wholesalePrice: '$7.80/ft',
    specifications: '15mm x 15mm, 1.6mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.6mm',
    size: '15mm',
    dimensions: '15mm x 15mm'
  },
  {
    id: 'square-20-1.6mm',
    name: '20mm Square Tube (Heavy)',
    image: '/src/images/Square Tubes 20mm Square Tube (1.6mm heavy gauge).webp',
    retailPrice: '$12.75/ft',
    wholesalePrice: '$10.20/ft',
    specifications: '20mm x 20mm, 1.6mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.6mm',
    size: '20mm',
    dimensions: '20mm x 20mm'
  },
  {
    id: 'square-30-1.6mm',
    name: '30mm Square Tube (Heavy)',
    image: '/src/images/Square Tubes 30mm Square Tube (1.6mm heavy gauge).webp',
    retailPrice: '$18.50/ft',
    wholesalePrice: '$14.80/ft',
    specifications: '30mm x 30mm, 1.6mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.6mm',
    size: '30mm',
    dimensions: '30mm x 30mm'
  },
  {
    id: 'square-40-1.6mm',
    name: '40mm Square Tube (Heavy)',
    image: '/src/images/Square Tubes 40mm Square Tube (1.6mm heavy gauge).webp',
    retailPrice: '$23.25/ft',
    wholesalePrice: '$18.60/ft',
    specifications: '40mm x 40mm, 1.6mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.6mm',
    size: '40mm',
    dimensions: '40mm x 40mm'
  },
  {
    id: 'square-50-1.6mm',
    name: '50mm Square Tube (Heavy)',
    image: '/src/images/Square Tubes 50mm Square Tube (1.6mm heavy gauge).jpg',
    retailPrice: '$29.00/ft',
    wholesalePrice: '$23.20/ft',
    specifications: '50mm x 50mm, 1.6mm wall thickness',
    category: 'Square Tubes',
    gauge: '1.6mm',
    size: '50mm',
    dimensions: '50mm x 50mm'
  },

  // Fx and F7 (Specialty Products)
  {
    id: 'fx-specialty',
    name: 'FX Specialty Steel',
    image: '/src/images/FX Specialty Steel.avif',
    retailPrice: '$25.50/ft',
    wholesalePrice: '$20.40/ft',
    specifications: 'FX grade steel for specialized applications',
    category: 'Specialty Steel'
  },
  {
    id: 'f7-specialty',
    name: 'F7 Specialty Steel',
    image: '/src/images/F7 Specialty Steel.avif',
    retailPrice: '$28.75/ft',
    wholesalePrice: '$23.00/ft',
    specifications: 'F7 grade steel for high-performance applications',
    category: 'Specialty Steel'
  },

  // Angle Iron
  {
    id: 'angle-25x25x3',
    name: '25x25x3mm Angle Iron',
    image: '/src/images/Angle Iron 25x25x3mm.jpg',
    retailPrice: '$6.25/ft',
    wholesalePrice: '$5.00/ft',
    specifications: '25mm x 25mm x 3mm thick angle iron',
    category: 'Angle Iron',
    dimensions: '25mm x 25mm x 3mm'
  },
  {
    id: 'angle-30x30x3',
    name: '30x30x3mm Angle Iron',
    image: '/src/images/30x30x3mm Angle Iron.webp',
    retailPrice: '$7.50/ft',
    wholesalePrice: '$6.00/ft',
    specifications: '30mm x 30mm x 3mm thick angle iron',
    category: 'Angle Iron',
    dimensions: '30mm x 30mm x 3mm'
  },
  {
    id: 'angle-40x40x3',
    name: '40x40x3mm Angle Iron',
    image: '/src/images/40x40x3mm Angle Iron.jpg',
    retailPrice: '$9.75/ft',
    wholesalePrice: '$7.80/ft',
    specifications: '40mm x 40mm x 3mm thick angle iron',
    category: 'Angle Iron',
    dimensions: '40mm x 40mm x 3mm'
  },

  // Flat Bar
  {
    id: 'flat-bar-20x3',
    name: '20x3mm Flat Bar',
    image: '/src/images/20x3mm Flat Bar.jpg',
    retailPrice: '$4.50/ft',
    wholesalePrice: '$3.60/ft',
    specifications: '20mm x 3mm flat steel bar',
    category: 'Flat Bar',
    dimensions: '20mm x 3mm'
  }
];

export const productCategories = [
  'All',
  'Round Tubes',
  'Square Tubes', 
  'Angle Iron',
  'Flat Bar',
  'Specialty Steel'
];