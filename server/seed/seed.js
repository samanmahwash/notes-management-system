const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Note = require('../models/Note');

const CATEGORY_SEED = [
  { name: 'Work', color: '#C89B3C' },
  { name: 'Personal', color: '#6B8F71' },
  { name: 'College', color: '#5A7D9A' },
  { name: 'Shopping', color: '#B5563C' },
  { name: 'Ideas', color: '#8B6BAE' },
  { name: 'Projects', color: '#3E7C6B' },
];

const NOTE_TITLES = [
  ['Q3 roadmap review', 'Work'],
  ['Grocery list', 'Shopping'],
  ['Book recommendations', 'Personal'],
  ['Thesis outline', 'College'],
  ['App redesign ideas', 'Ideas'],
  ['Sprint retro notes', 'Work'],
  ['Weekend trip planning', 'Personal'],
  ['New landing page copy', 'Projects'],
  ['Study schedule', 'College'],
  ['Gift ideas for mom', 'Shopping'],
  ['Startup pitch notes', 'Ideas'],
  ['Client onboarding checklist', 'Work'],
];

const destroy = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({ email: 'demo@notesapp.com' })]);
  const demoUser = await User.findOne({ email: 'demo@notesapp.com' });
  if (demoUser) {
    await Category.deleteMany({ userId: demoUser._id });
    await Note.deleteMany({ userId: demoUser._id });
  }
  console.log('Seed data destroyed');
  process.exit(0);
};

const seed = async () => {
  await connectDB();

  let user = await User.findOne({ email: 'demo@notesapp.com' });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email: 'demo@notesapp.com',
      password: 'password123',
    });
  }

  await Category.deleteMany({ userId: user._id });
  await Note.deleteMany({ userId: user._id });

  const categoryDocs = await Category.insertMany(
    CATEGORY_SEED.map((c) => ({ ...c, userId: user._id }))
  );
  const categoryMap = new Map(categoryDocs.map((c) => [c.name, c._id]));

  const notesToCreate = NOTE_TITLES.map(([title, catName], idx) => ({
    userId: user._id,
    title,
    content: `<p>This is a sample note about <strong>${title}</strong>. Edit this content to make it your own.</p>`,
    category: categoryMap.get(catName),
    color: CATEGORY_SEED.find((c) => c.name === catName)?.color || '#FAF7F2',
    favorite: idx % 4 === 0,
    pinned: idx % 5 === 0,
    archived: idx === NOTE_TITLES.length - 1,
  }));

  await Note.insertMany(notesToCreate);

  console.log('Seed data created:');
  console.log('  demo@notesapp.com / password123');
  console.log(`  ${categoryDocs.length} categories, ${notesToCreate.length} notes`);
  process.exit(0);
};

if (process.argv.includes('--destroy')) {
  destroy();
} else {
  seed();
}
