import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Cooper',
      password: hashedPassword,
      avatarUrl: 'https://i.pravatar.cc/150?u=alice',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: hashedPassword,
      avatarUrl: 'https://i.pravatar.cc/150?u=bob',
    },
  });

  // Create Posts
  const posts = [
    {
      title: 'Getting started with React 19',
      body: 'React 19 brings a lot of new features. In this post, we will explore the new compiler and hooks.',
      thumbnailUrl: 'https://picsum.photos/seed/react19/600/400',
      authorId: user1.id,
    },
    {
      title: 'NestJS and Prisma: A Perfect Match',
      body: 'Building scalable backends is easier than ever with NestJS and Prisma.',
      thumbnailUrl: 'https://picsum.photos/seed/nestjs/600/400',
      authorId: user2.id,
    },
    {
      title: 'Advanced Tailwind CSS Techniques',
      body: 'Learn how to build responsive layouts quickly with Tailwind v4.',
      thumbnailUrl: 'https://picsum.photos/seed/tailwind/600/400',
      authorId: user1.id,
    },
    {
      title: 'Why I love TypeScript',
      body: 'Type safety is crucial for large projects. Here is why TypeScript is my go-to language.',
      thumbnailUrl: 'https://picsum.photos/seed/ts/600/400',
      authorId: user2.id,
    },
    {
      title: 'Understanding Atomic Design',
      body: 'Atomic design helps organize components in a predictable way: Atoms, Molecules, Organisms, Templates, Pages.',
      thumbnailUrl: 'https://picsum.photos/seed/atomic/600/400',
      authorId: user1.id,
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });

    // Add some random comments and likes
    await prisma.comment.create({
      data: {
        content: 'Great read! Thanks for sharing.',
        postId: post.id,
        authorId: post.authorId === user1.id ? user2.id : user1.id,
      },
    });

    await prisma.postLike.create({
      data: {
        postId: post.id,
        userId: post.authorId === user1.id ? user2.id : user1.id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
