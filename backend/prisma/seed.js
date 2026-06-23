const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.blog.deleteMany({});

  // 2. Create Users
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('admin123', salt);
  const userPassword = bcrypt.hashSync('user123', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@mojuri.com',
      password: hashedPassword,
      name: 'Mojuri Admin',
      phone: '0987654321',
      address: '123 Jewelry Street, Hanoi',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      password: userPassword,
      name: 'Nguyen Van A',
      phone: '0123456789',
      address: '456 Silver Road, Ho Chi Minh',
      role: 'USER',
    },
  });

  console.log('Users seeded: ', { admin: admin.email, customer: customer.email });

  // 3. Create Products
  const productsData = [
    {
      name: 'Twin Hoops',
      description: 'Elegant dual-hoop earrings crafted from 14k yellow gold. Perfect for everyday luxury or special occasions.',
      thumbnail: 'media/product/3.jpg',
      images: JSON.stringify(['media/product/3.jpg', 'media/product/3-2.jpg']),
      price: 150.0,
      salePrice: 100.0,
      stock: 15,
      category: 'Earrings',
      status: 'IN_STOCK',
    },
    {
      name: 'Medium Flat Hoops',
      description: 'Chic flat-profile hoop earrings in sterling silver. Lightweight yet make a bold contemporary statement.',
      thumbnail: 'media/product/1.jpg',
      images: JSON.stringify(['media/product/1.jpg', 'media/product/1-2.jpg']),
      price: 100.0,
      salePrice: 80.0,
      stock: 20,
      category: 'Earrings',
      status: 'IN_STOCK',
    },
    {
      name: 'Bold Link Chain Necklace',
      description: 'A heavy-duty chain necklace featuring bold, statement links. Available in 18k gold-plated brass.',
      thumbnail: 'media/product/2.jpg',
      images: JSON.stringify(['media/product/2.jpg']),
      price: 250.0,
      salePrice: 200.0,
      stock: 8,
      category: 'Necklaces',
      status: 'IN_STOCK',
    },
    {
      name: 'Diamond Eternity Ring',
      description: 'A classic eternity band lined with brilliant-cut round diamonds, set in pure platinum.',
      thumbnail: 'media/product/4.jpg',
      images: JSON.stringify(['media/product/4.jpg']),
      price: 500.0,
      salePrice: null,
      stock: 5,
      category: 'Rings',
      status: 'IN_STOCK',
    },
    {
      name: 'Classic Leather Bracelet',
      description: 'Handcrafted braided leather bracelet with a secure magnetic clasp in stainless steel.',
      thumbnail: 'media/product/5.jpg',
      images: JSON.stringify(['media/product/5.jpg']),
      price: 80.0,
      salePrice: 60.0,
      stock: 25,
      category: 'Bracelets',
      status: 'IN_STOCK',
    },
    {
      name: 'Pearl Drop Earrings',
      description: 'Lustrous freshwater cultured pearls dangling gracefully from 18k white gold studs.',
      thumbnail: 'media/product/6.jpg',
      images: JSON.stringify(['media/product/6.jpg']),
      price: 180.0,
      salePrice: null,
      stock: 12,
      category: 'Earrings',
      status: 'IN_STOCK',
    },
    {
      name: 'Gold Chain Necklace',
      description: 'A delicate and minimal solid gold chain, perfect for layering or wearing with your favorite pendant.',
      thumbnail: 'media/product/7.jpg',
      images: JSON.stringify(['media/product/7.jpg']),
      price: 300.0,
      salePrice: null,
      stock: 10,
      category: 'Necklaces',
      status: 'IN_STOCK',
    },
    {
      name: 'Minimalist Silver Ring',
      description: 'A simple, sleek sterling silver band with a polished finish. An essential accessory for any wardrobe.',
      thumbnail: 'media/product/8.jpg',
      images: JSON.stringify(['media/product/8.jpg']),
      price: 90.0,
      salePrice: 70.0,
      stock: 30,
      category: 'Rings',
      status: 'IN_STOCK',
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`${productsData.length} products seeded.`);

  // 4. Create Blogs
  const blogsData = [
    {
      title: 'How to Care for Your Gold and Silver Jewelry',
      content: '<p>Jewelry is one of our most intimate and cherished accessories. Understanding how to care for and protect your treasured jewelry can make a world of difference in maintaining its beauty and keeping your heirlooms sparkling for generations to come.</p><h4>1. Keep it dry and clean</h4><p>Avoid exposing your jewelry to household chemicals, perspiration, cosmetics, and perfumes. Always take off your rings and bracelets before washing hands, showering, or doing chores.</p>',
      coverImage: 'media/blog/1.jpg',
      category: 'Tips',
      status: 'PUBLISHED',
    },
    {
      title: 'The Ultimate Guide to Diamond Cuts and Settings',
      content: '<p>Choosing a diamond ring can be overwhelming. In this guide, we break down the famous 4Cs (Cut, Clarity, Color, and Carat) and explore popular ring settings like Prong, Bezel, and Pavé to help you find the perfect match.</p>',
      coverImage: 'media/blog/2.jpg',
      category: 'News',
      status: 'PUBLISHED',
    },
    {
      title: 'Top 5 Jewelry Trends for the Upcoming Summer Season',
      content: '<p>From chunky gold chains to colorful gemstone earrings, here are the jewelry trends dominating the runways and streets this summer. Find out how to style them with your casual wardrobes.</p>',
      coverImage: 'media/blog/3.jpg',
      category: 'Collections',
      status: 'PUBLISHED',
    },
  ];

  for (const blog of blogsData) {
    await prisma.blog.create({
      data: blog,
    });
  }

  console.log(`${blogsData.length} blog posts seeded.`);

  // 5. Create Contact Messages
  await prisma.contact.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      subject: 'Custom ring inquiry',
      message: 'Hello, I am interested in creating a custom platinum ring. Could you please let me know the process and pricing details? Thanks!',
      isRead: false,
    },
  });

  await prisma.contact.create({
    data: {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      subject: 'Shipping delay',
      message: 'Hello, my order #1234 has not arrived yet. Could you check the tracking status for me? Thank you.',
      isRead: true,
    },
  });

  console.log('Contact messages seeded.');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
