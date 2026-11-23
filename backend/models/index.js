const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User       = require('./User');
const Profile    = require('./Profile');
const Skill      = require('./Skill');
const Project    = require('./Project');
const Experience = require('./Experience');
const Education  = require('./Education');
const Service    = require('./Service');
const Message    = require('./Message');

// ── Seed helpers ──────────────────────────────────────────────────────────────

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@kavin.dev';
  const exists = await User.findOne({ where: { email } });
  if (exists) return;

  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  // Password hashing is handled by the beforeCreate hook in User.js
  await User.create({ name: 'Kavin B', email, password, role: 'admin' });
  console.log(`[Seed] Admin user created → ${email}`);
}

async function seedProfile() {
  const existing = await Profile.findOne();
  if (existing) {
    const updates = {};
    if (existing.email === 'kavin@example.com') updates.email = 'kavinkbs2202@gmail.com';
    if (existing.phone === '+91 98765 43210' || existing.phone === '+91 90256 63438') updates.phone = '+91 90258 63438';
    if (Object.keys(updates).length) await existing.update(updates);
    return;
  }

  await Profile.create({
    name: 'Kavin B',
    title: 'Full Stack Developer',
    bio: 'Passionate Full Stack Developer specialising in building scalable web applications with modern technologies including React.js, Node.js, Laravel and MySQL.',
    email: 'kavinkbs2202@gmail.com',
    phone: '+91 90258 63438',
    location: 'Tamil Nadu, India',
    github_url: '',
    linkedin_url: '',
    resume_url: '',
    years_of_experience: 2,
    projects_completed: 15,
    clients_served: 0,
    avatar_url: '',
  });
  console.log('[Seed] Default profile created.');
}

async function seedSkills() {
  const count = await Skill.count();
  if (count > 0) return;

  const defaults = [
    { name: 'PHP', category: 'backend', level: 3, display_order: 1 },
    { name: 'Laravel', category: 'backend', level: 3, display_order: 2 },
    { name: 'JavaScript', category: 'frontend', level: 3, display_order: 3 },
    { name: 'React JS', category: 'frontend', level: 3, display_order: 4 },
    { name: 'HTML5', category: 'frontend', level: 3, display_order: 5 },
    { name: 'CSS3', category: 'frontend', level: 3, display_order: 6 },
    { name: 'Bootstrap', category: 'frontend', level: 2, display_order: 7 },
    { name: 'Tailwind CSS', category: 'frontend', level: 3, display_order: 8 },
    { name: 'MySQL', category: 'database', level: 3, display_order: 9 },
    { name: 'MongoDB', category: 'database', level: 2, display_order: 10 },
    { name: 'Git', category: 'tools', level: 3, display_order: 11 },
    { name: 'GitHub', category: 'tools', level: 3, display_order: 12 },
    { name: 'Figma', category: 'tools', level: 1, display_order: 13 },
  ];
  await Skill.bulkCreate(defaults);
  console.log('[Seed] Default skills created.');
}

async function seedServices() {
  const count = await Service.count();
  if (count > 0) return;

  const defaults = [
    { title: 'Full Stack Web Development', description: 'End-to-end web application development using React, Node.js, Laravel and MySQL.', icon: 'Globe', display_order: 1 },
    { title: 'REST API Development',       description: 'Design and build robust, scalable RESTful APIs with proper authentication and documentation.', icon: 'Server', display_order: 2 },
    { title: 'Frontend Development',       description: 'Pixel-perfect, responsive UI development with React, Tailwind CSS and modern animation libraries.', icon: 'Monitor', display_order: 3 },
    { title: 'Backend Development',        description: 'Scalable server-side applications using Node.js / Express or PHP / Laravel with secure data management.', icon: 'Code2', display_order: 4 },
    { title: 'Database Design',            description: 'Relational database design, optimisation, and migration for MySQL and MongoDB.', icon: 'Database', display_order: 5 },
    { title: 'Tech Consulting',            description: 'Architecture reviews, tech-stack recommendations, and best-practice guidance for your project.', icon: 'Lightbulb', display_order: 6 },
  ];
  await Service.bulkCreate(defaults);
  console.log('[Seed] Default services created.');
}

async function seedProjects() {
  const count = await Project.count();
  if (count > 0) return;

  await Project.create({
    title: 'Radhe Crackers – E-Commerce Platform',
    slug: 'radhe-crackers',
    short_description: 'Full-stack e-commerce platform for a fireworks retailer built with Laravel and MySQL.',
    full_description: 'Radhe Crackers is a complete e-commerce solution featuring product catalogue management, cart & checkout flow, order tracking, admin dashboard, and a responsive storefront. Built with PHP / Laravel on the backend and plain JavaScript + Bootstrap on the frontend.',
    thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80',
    technologies: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Bootstrap', 'REST API'],
    features: ['Product catalogue with categories', 'Shopping cart & checkout', 'Order management', 'Admin panel', 'Responsive design'],
    is_featured: true,
    display_order: 1,
  });
  await Project.bulkCreate([
    {
      title: 'MERN Enterprise Workflow Hub', slug: 'mern-enterprise-workflow-hub',
      short_description: 'Real-time project management dashboard with collaborative boards, JWT authentication and live metrics.',
      full_description: 'MERN enterprise workflow hub with collaboration boards and authentication.',
      thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
      technologies: ['React', 'Node.js', 'MongoDB'], features: [], is_featured: true, display_order: 2,
    },
    {
      title: 'Secure REST API Gateway & Auth Service', slug: 'secure-rest-api-gateway',
      short_description: 'Microservice-ready REST API with rate limiting, token refresh, encryption and a MySQL schema.',
      full_description: 'Secure REST API gateway and authentication service.',
      thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
      technologies: ['Node.js', 'Express', 'JWT'], features: [], is_featured: true, display_order: 3,
    },
  ]);
  console.log('[Seed] Sample project created.');
}

async function seedAdditionalProjects() {
  const projects = [
    {
      title: 'MERN Enterprise Workflow Hub', slug: 'mern-enterprise-workflow-hub',
      short_description: 'Real-time project management dashboard with collaborative boards, JWT authentication and live metrics.',
      full_description: 'MERN enterprise workflow hub with collaboration boards and authentication.',
      thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
      technologies: ['React', 'Node.js', 'MongoDB'], features: [], is_featured: true, display_order: 2,
    },
    {
      title: 'Secure REST API Gateway & Auth Service', slug: 'secure-rest-api-gateway',
      short_description: 'Microservice-ready REST API with rate limiting, token refresh, encryption and a MySQL schema.',
      full_description: 'Secure REST API gateway and authentication service.',
      thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
      technologies: ['Node.js', 'Express', 'JWT'], features: [], is_featured: true, display_order: 3,
    },
  ];
  for (const project of projects) {
    const existing = await Project.findOne({ where: { slug: project.slug } });
    if (!existing) await Project.create(project);
  }
}

async function seedExperienceAndEducation() {
  if (!(await Experience.count())) {
    await Experience.create({
      company: 'Tech Solutions Inc.', designation: 'PHP Laravel & Full Stack Developer',
      start_date: '2024-01-01', end_date: null, is_current: true,
      description: 'Building Laravel and MERN products.',
      responsibilities: [
        'Built modular Laravel applications and documented REST APIs consumed by React and mobile clients.',
        'Delivered dynamic CRUD systems with validation and error handling.',
        'Integrated Stripe and Razorpay payments and Facebook Lead Ads sync into an internal CRM.',
        'Designed normalized MySQL schemas and tuned slow queries.',
      ],
      technologies: ['PHP', 'Laravel', 'MySQL', 'React.js', 'Node.js', 'REST APIs'], display_order: 1,
    });
  }
  if (!(await Education.count())) {
    await Education.create({
      degree: 'B.E. Computer Science and Engineering',
      institution: 'M. Kumarasamy College of Engineering, Karur',
      start_year: 2021, end_year: 2025, cgpa: 8.152, display_order: 1,
    });
  }
}

// ── Sync & seed ───────────────────────────────────────────────────────────────

async function syncModels() {
  // alter: true updates columns without dropping data (safe for dev)
  await sequelize.sync({ alter: true });
  console.log('[DB] All tables synced.');

  await seedAdmin();
  await seedProfile();
  await seedSkills();
  await seedServices();
  await seedExperienceAndEducation();
}

module.exports = {
  sequelize,
  syncModels,
  User,
  Profile,
  Skill,
  Project,
  Experience,
  Education,
  Service,
  Message,
};
