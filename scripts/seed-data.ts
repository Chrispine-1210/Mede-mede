import { db } from '../server/db';
import { users, products, events } from '@shared/schema';

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user
    const adminUser = await db
      .insert(users)
      .values({
        id: 'admin-001',
        email: 'admin@mede-mede.mw',
        firstName: 'Admin',
        lastName: 'Manager',
        role: 'admin',
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    console.log('✅ Admin user created/exists');

    // Create driver user
    const driverUser = await db
      .insert(users)
      .values({
        id: 'driver-001',
        email: 'driver@mede-mede.mw',
        firstName: 'John',
        lastName: 'Driver',
        role: 'driver',
        isActive: true,
        vehicleNumber: 'MZ AB 1234',
        driverLicenseNumber: 'DL123456',
        isAvailableForDelivery: true,
      })
      .onConflictDoNothing()
      .returning();

    console.log('✅ Driver user created/exists');

    // Create customer user
    const customerUser = await db
      .insert(users)
      .values({
        id: 'customer-001',
        email: 'customer@mede-mede.mw',
        firstName: 'Alice',
        lastName: 'Customer',
        role: 'customer',
        isActive: true,
        phoneNumber: '+265999999999',
      })
      .onConflictDoNothing()
      .returning();

    console.log('✅ Customer user created/exists');

    // Seed products - Flowers (loose varieties)
    const flowerProducts = [
      {
        name: 'Premium Indica Flower',
        description: 'High-quality Indica strain with deep forest notes',
        productType: 'flower',
        strainType: 'Indica',
        pricePerGram: 3500, // 3,500 MWK per gram
        stockQuantity: 50,
        isAvailable: true,
      },
      {
        name: 'Golden Sativa Flower',
        description: 'Energizing Sativa strain, perfect for daytime',
        productType: 'flower',
        strainType: 'Sativa',
        pricePerGram: 3000, // 3,000 MWK per gram
        stockQuantity: 40,
        isAvailable: true,
      },
      {
        name: 'Balanced Hybrid Flower',
        description: 'Perfect balance of Indica and Sativa',
        productType: 'flower',
        strainType: 'Hybrid',
        pricePerGram: 3200, // 3,200 MWK per gram
        stockQuantity: 60,
        isAvailable: true,
      },
    ];

    for (const flower of flowerProducts) {
      await db
        .insert(products)
        .values({
          name: flower.name,
          description: flower.description,
          productType: flower.productType,
          strainType: flower.strainType,
          pricePerGram: flower.pricePerGram,
          stockQuantity: flower.stockQuantity,
          isAvailable: flower.isAvailable,
        })
        .onConflictDoNothing();
    }

    console.log('✅ Flower products created/exist');

    // Seed products - Pre-rolled packages
    const prerolledProducts = [
      {
        name: 'Mini Pre-Roll Pack',
        description: '500mg pre-rolled package, single stick',
        productType: 'preroll',
        size: '500',
        totalPrice: 500, // 500 MWK
        stockQuantity: 100,
        isAvailable: true,
      },
      {
        name: 'Standard Pre-Roll Pack',
        description: '1000mg pre-rolled package, 2 sticks',
        productType: 'preroll',
        size: '1000',
        totalPrice: 1000, // 1,000 MWK
        stockQuantity: 80,
        isAvailable: true,
      },
      {
        name: 'Premium Pre-Roll Pack',
        description: '1500mg pre-rolled package, 3 sticks',
        productType: 'preroll',
        size: '1500',
        totalPrice: 1500, // 1,500 MWK
        stockQuantity: 60,
        isAvailable: true,
      },
      {
        name: 'Deluxe Pre-Roll Pack',
        description: '2000mg pre-rolled package, 4 sticks',
        productType: 'preroll',
        size: '2000',
        totalPrice: 2000, // 2,000 MWK
        stockQuantity: 40,
        isAvailable: true,
      },
    ];

    for (const preroll of prerolledProducts) {
      await db
        .insert(products)
        .values({
          name: preroll.name,
          description: preroll.description,
          productType: preroll.productType,
          size: preroll.size,
          totalPrice: preroll.totalPrice,
          stockQuantity: preroll.stockQuantity,
          isAvailable: preroll.isAvailable,
        })
        .onConflictDoNothing();
    }

    console.log('✅ Pre-rolled products created/exist');

    // Seed events
    const eventsList = [
      {
        name: 'Weekend Special - 20% Off',
        description: 'Enjoy 20% discount on all products this weekend',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        discountPercentage: 20,
        isActive: true,
      },
      {
        name: 'New Customer Welcome - 500 MWK Off',
        description: 'New customers get 500 MWK off their first order',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        discountAmount: 500,
        isActive: true,
      },
    ];

    for (const event of eventsList) {
      await db
        .insert(events)
        .values(event)
        .onConflictDoNothing();
    }

    console.log('✅ Events created/exist');

    console.log('✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
