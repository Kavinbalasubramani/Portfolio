import React from 'react';
import { GraduationCap, Award, Calendar, BookOpen, MapPin } from 'lucide-react';

const Education = ({ education: externalEdu }) => {
  const defaultEducation = [
    {
      degree: 'B.E. Computer Science and Engineering',
      institution: 'M. Kumarasamy College of Engineering',
      startYear: '2021',
      endYear: '2025',
      cgpa: '8.152',
      description: 'Comprehensive engineering degree covering Software Engineering, Object-Oriented Programming, Database Management Systems, Data Structures & Algorithms, Computer Networks, and Cloud Computing.',
    }
  ];

  const source = externalEdu && externalEdu.length > 0 ? externalEdu : defaultEducation;
  const list = source.map((edu) => ({
    ...edu,
    startYear: edu.startYear || edu.start_year,
    endYear: edu.endYear || edu.end_year,
  }));

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080D1A] border-y border-slate-800/60 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Education & <span className="text-sky-400">Qualifications</span>
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Formal degree in Computer Science, reinforcing strong engineering foundations.
          </p>
        </div>

        {/* Education Cards */}
        <div className="space-y-6">
          {list.map((edu, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 hover:border-slate-700 transition-all shadow-xl shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-sky-400 font-medium text-sm">
                      {edu.institution}
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed pt-1">
                  {edu.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {edu.startYear} – {edu.endYear}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Karur, Tamil Nadu
                  </span>
                </div>
              </div>

              {/* CGPA Badge */}
              <div className="flex md:flex-col items-center justify-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-6 py-4 min-w-[140px] text-center">
                <Award className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-2xl font-extrabold text-white font-heading">
                  {edu.cgpa}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  CGPA / 10.0
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
