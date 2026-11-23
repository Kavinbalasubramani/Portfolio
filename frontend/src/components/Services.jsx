import React from 'react';
import { Layout, Server, Network, ShoppingCart, Database, Link2, Sparkles, Globe, Monitor, Code2, Lightbulb, Cpu, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const serviceMetaMap = {
  globe: {
    icon: Globe,
    color: 'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30',
  },
  server: {
    icon: Server,
    color: 'from-indigo-500/20 to-purple-600/20 text-indigo-400 border-indigo-500/30',
  },
  monitor: {
    icon: Monitor,
    color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
  },
  layout: {
    icon: Layout,
    color: 'from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30',
  },
  code2: {
    icon: Code2,
    color: 'from-rose-500/20 to-pink-600/20 text-rose-400 border-rose-500/30',
  },
  database: {
    icon: Database,
    color: 'from-sky-500/20 to-cyan-600/20 text-sky-400 border-sky-500/30',
  },
  lightbulb: {
    icon: Lightbulb,
    color: 'from-amber-500/20 to-yellow-600/20 text-amber-400 border-amber-500/30',
  },
  network: {
    icon: Network,
    color: 'from-purple-500/20 to-indigo-600/20 text-purple-400 border-purple-500/30',
  },
  shoppingcart: {
    icon: ShoppingCart,
    color: 'from-orange-500/20 to-rose-600/20 text-orange-400 border-orange-500/30',
  },
  cpu: {
    icon: Cpu,
    color: 'from-teal-500/20 to-emerald-600/20 text-teal-400 border-teal-500/30',
  },
};

const resolveServiceMeta = (iconName, title = '') => {
  const key = (typeof iconName === 'string' ? iconName : title).toLowerCase().replace(/[\s-_]/g, '');
  for (const [k, meta] of Object.entries(serviceMetaMap)) {
    if (key.includes(k)) return meta;
  }
  return {
    icon: Link2,
    color: 'from-blue-500/20 to-indigo-600/20 text-blue-400 border-blue-500/30',
  };
};

const Services = ({ services: externalServices }) => {
  const defaultServices = [
    {
      title: 'Full Stack Web Development',
      description: 'End-to-end web application development using React, Node.js, Laravel and MySQL with modern scalable architectures.',
      icon: 'Globe',
    },
    {
      title: 'REST API Development',
      description: 'Design and build robust, scalable RESTful APIs with proper authentication, rate limiting, and comprehensive documentation.',
      icon: 'Server',
    },
    {
      title: 'Frontend Development',
      description: 'Pixel-perfect, responsive UI development with React, Tailwind CSS, TypeScript, and modern smooth animation libraries.',
      icon: 'Monitor',
    },
    {
      title: 'Backend Development',
      description: 'Scalable server-side applications using Node.js / Express or PHP / Laravel with secure data management and high throughput.',
      icon: 'Code2',
    },
    {
      title: 'Database Architecture',
      description: 'Relational database design, query optimization, indexing strategies, and migration pipelines for MySQL and MongoDB.',
      icon: 'Database',
    },
    {
      title: 'Tech Consulting & Optimization',
      description: 'Architecture reviews, tech-stack recommendations, performance audits, and best-practice guidance for web platforms.',
      icon: 'Lightbulb',
    }
  ];

  const list = externalServices && externalServices.length > 0 ? externalServices : defaultServices;

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-[#0A0F1D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center space-y-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
            Specialized <span className="hero-gradient">Services</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Comprehensive full-stack engineering services tailored for startups, businesses, and agency projects.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((srv, idx) => {
            const meta = resolveServiceMeta(srv.icon, srv.title);
            const IconComponent = typeof srv.icon === 'function' ? srv.icon : meta.icon;
            const badgeColor = srv.color || meta.color;

            return (
              <motion.div
                key={srv.id || idx}
                className="group rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-900 transition-all duration-300 hover:shadow-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col justify-between hover:-translate-y-1.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr ${badgeColor} border mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span>Available for Contract &amp; Full-Time</span>
                  <a href="#contact" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                    Inquire <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
