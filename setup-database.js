// Database setup script for Acero Steel Supply
// This script will create the database schema and populate it with your steel products

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/acero_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Your steel products data
const steelProducts = [
  // Round Tubes - Light Gauge (1.2mm)
  { name: '19mm Round Tube', category: 'Round Tubes', specifications: '19mm diameter, 1.2mm wall thickness', retail_price: 8.50, wholesale_price: 6.80, image_url: '/src/images/Round Tubes 19mm Round Tube (1.2mm gauge).jpg' },
  { name: '25mm Round Tube', category: 'Round Tubes', specifications: '25mm diameter, 1.2mm wall thickness', retail_price: 10.25, wholesale_price: 8.20, image_url: '/src/images/Round Tubes 25mm Round Tube (1.2mm gauge).jpg' },
  { name: '32mm Round Tube', category: 'Round Tubes', specifications: '32mm diameter, 1.2mm wall thickness', retail_price: 12.75, wholesale_price: 10.20, image_url: '/src/images/Round Tubes 32mm Round Tube (1.2mm gauge).jpg' },
  { name: '38mm Round Tube', category: 'Round Tubes', specifications: '38mm diameter, 1.2mm wall thickness', retail_price: 14.50, wholesale_price: 11.60, image_url: '/src/images/Round Tubes 38mm Round Tube (1.2mm gauge).jpg' },
  { name: '50mm Round Tube', category: 'Round Tubes', specifications: '50mm diameter, 1.2mm wall thickness', retail_price: 18.25, wholesale_price: 14.60, image_url: '/src/images/Round Tubes 50mm Round Tube (1.2mm gauge).jpg' },
  { name: '63mm Round Tube', category: 'Round Tubes', specifications: '63mm diameter, 1.2mm wall thickness', retail_price: 22.40, wholesale_price: 17.92, image_url: '/src/images/Round Tubes 63mm Round Tube (1.2mm gauge).jpg' },
  { name: '76mm Round Tube', category: 'Round Tubes', specifications: '76mm diameter, 1.2mm wall thickness', retail_price: 26.80, wholesale_price: 21.44, image_url: '/src/images/Round Tubes 76mm Round Tube (1.2mm gauge).jpg' },

  // Round Tubes - Heavy Gauge (1.6mm)
  { name: '19mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '19mm diameter, 1.6mm wall thickness', retail_price: 11.25, wholesale_price: 9.00, image_url: '/src/images/Round Tubes 19mm Round Tube (1.6mm heavy gauge).jpg' },
  { name: '25mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '25mm diameter, 1.6mm wall thickness', retail_price: 13.50, wholesale_price: 10.80, image_url: '/src/images/Round Tubes 25mm Round Tube (1.6mm heavy gauge.jpg' },
  { name: '32mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '32mm diameter, 1.6mm wall thickness', retail_price: 16.75, wholesale_price: 13.40, image_url: '/src/images/Round Tubes 32mm Round Tube (1.6mm heavy gauge).jpg' },
  { name: '38mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '38mm diameter, 1.6mm wall thickness', retail_price: 19.25, wholesale_price: 15.40, image_url: '/src/images/Round Tube 38mm Round Tube (1.6mm heavy gauge).jpg' },
  { name: '50mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '50mm diameter, 1.6mm wall thickness', retail_price: 24.50, wholesale_price: 19.60, image_url: '/src/images/Round Tubes 50mm Round Tube (1.6mm heavy gauge).webp' },
  { name: '63mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '63mm diameter, 1.6mm wall thickness', retail_price: 30.25, wholesale_price: 24.20, image_url: '/src/images/Round Tubes 63mm Round Tube (1.6mm heavy gauge).webp' },
  { name: '76mm Round Tube (Heavy)', category: 'Round Tubes', specifications: '76mm diameter, 1.6mm wall thickness', retail_price: 36.50, wholesale_price: 29.20, image_url: '/src/images/Round Tubes 76mm Round Tube (1.6mm heavy gauge).avif' },

  // Square Tubes - Light Gauge (1.2mm)
  { name: '15mm Square Tube', category: 'Square Tubes', specifications: '15mm x 15mm, 1.2mm wall thickness', retail_price: 7.25, wholesale_price: 5.80, image_url: '/src/images/Square Tubes 15mm Square Tube (1.2mm gauge).jpg' },
  { name: '20mm Square Tube', category: 'Square Tubes', specifications: '20mm x 20mm, 1.2mm wall thickness', retail_price: 9.50, wholesale_price: 7.60, image_url: '/src/images/Square Tubes 20mm Square Tube (1.2mm gauge).jpg' },
  { name: '30mm Square Tube', category: 'Square Tubes', specifications: '30mm x 30mm, 1.2mm wall thickness', retail_price: 13.75, wholesale_price: 11.00, image_url: '/src/images/Square Tubes 30mm Square Tube (1.2mm gauge).webp' },
  { name: '40mm Square Tube', category: 'Square Tubes', specifications: '40mm x 40mm, 1.2mm wall thickness', retail_price: 17.25, wholesale_price: 13.80, image_url: '/src/images/Square Tubes 40mm Square Tube (1.2mm gauge).jpg' },
  { name: '50mm Square Tube', category: 'Square Tubes', specifications: '50mm x 50mm, 1.2mm wall thickness', retail_price: 21.50, wholesale_price: 17.20, image_url: '/src/images/Square Tubes 50mm Square Tube (1.2mm gauge).jfif' },

  // Square Tubes - Heavy Gauge (1.6mm)
  { name: '15mm Square Tube (Heavy)', category: 'Square Tubes', specifications: '15mm x 15mm, 1.6mm wall thickness', retail_price: 9.75, wholesale_price: 7.80, image_url: '/src/images/Square Tubes 15mm Square Tube (1.6mm heavy gauge).png' },
  { name: '20mm Square Tube (Heavy)', category: 'Square Tubes', specifications: '20mm x 20mm, 1.6mm wall thickness', retail_price: 12.75, wholesale_price: 10.20, image_url: '/src/images/Square Tubes 20mm Square Tube (1.6mm heavy gauge).webp' },
  { name: '30mm Square Tube (Heavy)', category: 'Square Tubes', specifications: '30mm x 30mm, 1.6mm wall thickness', retail_price: 18.50, wholesale_price: 14.80, image_url: '/src/images/Square Tubes 30mm Square Tube (1.6mm heavy gauge).webp' },
  { name: '40mm Square Tube (Heavy)', category: 'Square Tubes', specifications: '40mm x 40mm, 1.6mm wall thickness', retail_price: 23.25, wholesale_price: 18.60, image_url: '/src/images/Square Tubes 40mm Square Tube (1.6mm heavy gauge).webp' },
  { name: '50mm Square Tube (Heavy)', category: 'Square Tubes', specifications: '50mm x 50mm, 1.6mm wall thickness', retail_price: 29.00, wholesale_price: 23.20, image_url: '/src/images/Square Tubes 50mm Square Tube (1.6mm heavy gauge).jpg' },

  // Fx and F7 (Specialty Products)
  { name: 'FX Specialty Steel', category: 'Specialty Steel', specifications: 'FX grade steel for specialized applications', retail_price: 25.50, wholesale_price: 20.40, image_url: '/src/images/FX Specialty Steel.avif' },
  { name: 'F7 Specialty Steel', category: 'Specialty Steel', specifications: 'F7 grade steel for high-performance applications', retail_price: 28.75, wholesale_price: 23.00, image_url: '/src/images/F7 Specialty Steel.avif' },

  // Angle Iron
  { name: '25x25x3mm Angle Iron', category: 'Angle Iron', specifications: '25mm x 25mm x 3mm thick angle iron', retail_price: 6.25, wholesale_price: 5.00, image_url: '/src/images/Angle Iron 25x25x3mm.jpg' },
  { name: '30x30x3mm Angle Iron', category: 'Angle Iron', specifications: '30mm x 30mm x 3mm thick angle iron', retail_price: 7.50, wholesale_price: 6.00, image_url: '/src/images/30x30x3mm Angle Iron.webp' },
  { name: '40x40x3mm Angle Iron', category: 'Angle Iron', specifications: '40mm x 40mm x 3mm thick angle iron', retail_price: 9.75, wholesale_price: 7.80, image_url: '/src/images/40x40x3mm Angle Iron.jpg' },

  // Flat Bar
  { name: '20x3mm Flat Bar', category: 'Flat Bar', specifications: '20mm x 3mm flat steel bar', retail_price: 4.50, wholesale_price: 3.60, image_url: '/src/images/20x3mm Flat Bar.jpg' }
];

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up Acero Steel Supply Database...');
    
    // Read and execute the schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating database schema...');
    await client.query(schema);
    console.log('✅ Database schema created successfully!');
    
    // Clear existing products and insert your steel products
    console.log('🗑️ Clearing existing products...');
    await client.query('DELETE FROM products');
    
    console.log('📦 Inserting steel products...');
    for (const product of steelProducts) {
      await client.query(
        `INSERT INTO products (name, category, specifications, retail_price, wholesale_price, image_url, stock_quantity) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [product.name, product.category, product.specifications, product.retail_price, product.wholesale_price, product.image_url, 100]
      );
    }
    
    console.log(`✅ Inserted ${steelProducts.length} steel products!`);
    
    // Create a demo admin user
    console.log('👤 Creating demo admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminResult = await client.query(
      `INSERT INTO users (email, password_hash, name, phone, company, email_verified, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['admin@acerosteel.com', hashedPassword, 'Admin User', '+263 77 463 7836', 'Acero Steel Supply', true, true]
    );
    
    if (adminResult.rows.length > 0) {
      const adminId = adminResult.rows[0].id;
      
      // Assign admin role
      const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', ['admin']);
      if (roleResult.rows.length > 0) {
        await client.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [adminId, roleResult.rows[0].id]
        );
      }
      
      console.log('✅ Demo admin user created!');
      console.log('📧 Email: admin@acerosteel.com');
      console.log('🔑 Password: admin123');
    }
    
    // Create a demo customer user
    console.log('👤 Creating demo customer user...');
    const customerPassword = await bcrypt.hash('customer123', 12);
    
    const customerResult = await client.query(
      `INSERT INTO users (email, password_hash, name, phone, company, email_verified, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['customer@example.com', customerPassword, 'Demo Customer', '+263 77 123 4567', 'Demo Company', true, true]
    );
    
    if (customerResult.rows.length > 0) {
      const customerId = customerResult.rows[0].id;
      
      // Assign customer role
      const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', ['customer']);
      if (roleResult.rows.length > 0) {
        await client.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [customerId, roleResult.rows[0].id]
        );
      }
      
      console.log('✅ Demo customer user created!');
      console.log('📧 Email: customer@example.com');
      console.log('🔑 Password: customer123');
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${steelProducts.length} steel products inserted`);
    console.log('   • Demo admin user created');
    console.log('   • Demo customer user created');
    console.log('   • All database rules and constraints applied');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n✅ Setup complete! You can now start your backend server.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase, steelProducts };
