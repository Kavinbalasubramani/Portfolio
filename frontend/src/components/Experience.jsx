import React from 'react';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Experience = ({ experiences: externalExp }) => {
  const defaultExperiences = [
    {
      company: 'Tech Solutions Inc.',
      designation: 'PHP Laravel & Full Stack Developer',
      startDate: '2024',
      endDate: 'Present',
      isCurrent: true,
      description: 'Engineering enterprise Laravel and MERN applications, creating high-performance REST APIs, and maintaining relational MySQL databases.',
      responsibilities: [
        'Built modular Laravel applications and documented REST APIs consumed by React and mobile clients.',
        'Delivered dynamic CRUD systems with robust validation and error handling.',
        'Integrated Stripe and Razorpay payment gateways with webhook handling.',
        'Automated Facebook Lead Ads synchronization directly into internal CRM databases.',
        'Designed normalized relational schemas and optimized queries in MySQL.',
      ],
      technologies: ['PHP', 'Laravel', 'MySQL', 'React.js', 'Node.js', 'REST APIs', 'Git', 'Bootstrap', 'Tailwind CSS']
    }
  ];

  const source = externalExp && externalExp.length > 0 ? externalExp : defaultExperiences;
  const list = source.map((exp) => {
    let responsibilities = [];
    if (Array.isArray(exp.responsibilities)) {
      responsibilities = exp.responsibilities;
    } else if (typeof exp.responsibilities === 'string') {
      try {
        const parsed = JSON.parse(exp.responsibilities);
        responsibilities = Array.isArray(parsed) ? parsed : [exp.responsibilities];
      } catch {
        responsibilities = [exp.responsibilities];
      }
    }

    let technologies = [];
    if (Array.isArray(exp.technologies)) {
      technologies = exp.technologies;
    } else if (typeof exp.technologies === 'string') {
      try {
        const parsed = JSON.parse(exp.technologies);
        technologies = Array.isArray(parsed) ? parsed : exp.technologies.split(',').map(s => s.trim());
      } catch {
        technologies = exp.technologies.split(',').map(s => s.trim());
      }
    }

    return {
      ...exp,
      startDate: exp.startDate || exp.start_date,
      endDate: exp.endDate || exp.end_date,
      isCurrent: exp.isCurrent ?? exp.is_current,
      responsibilities,
      technologies,
    };
  });

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-[#080D1A] border-y border-slate-200 dark:border-slate-800/60 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center space-y-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
            Work <span className="hero-gradient">Experience</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Practical industry track record delivering commercial web applications and API architectures.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-500/30 space-y-12">
          {list.map((exp, index) => (
            <motion.div
              key={exp.id || index}
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline Glowing Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-sky-500 border-4 border-white dark:border-[#080D1A] shadow-md shadow-sky-500/50 group-hover:scale-125 transition-transform" />

              {/* Experience Card */}
              <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-900 transition-all shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                      {exp.designation}
                    </h3>
                    <p className="text-sky-600 dark:text-sky-400 font-semibold text-sm mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="inline-flex items-center space-x-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 w-fit shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                    <span>{exp.startDate} – {exp.endDate || (exp.isCurrent ? 'Present' : '')}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Key Responsibilities */}
                <div className="space-y-2.5 mb-6">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Key Responsibilities &amp; Achievements:
                  </h4>
                  <ul className="space-y-2.5">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Technologies Utilized:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
