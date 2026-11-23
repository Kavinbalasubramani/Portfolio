import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Services from '../components/Services';
import Contact from '../components/Contact';
import api from '../services/api';

const Home = () => {
  const [data, setData] = useState({
    skills: null,
    projects: null,
    experiences: null,
    education: null,
    services: null,
    profile: null,
  });

  useEffect(() => {
    // Dynamic fetch from backend API
    const fetchPortfolioData = async () => {
      try {
        const [skillsRes, projectsRes, expRes, eduRes, srvRes, profileRes] = await Promise.allSettled([
          api.get('/skills'),
          api.get('/projects'),
          api.get('/experience'),
          api.get('/education'),
          api.get('/services'),
          api.get('/profile'),
        ]);

        const unwrap = (result) => {
          if (result.status !== 'fulfilled') return null;
          const body = result.value;
          return body?.data?.data ?? body?.data ?? body;
        };

        setData({
          skills: unwrap(skillsRes),
          projects: unwrap(projectsRes) || [],
          experiences: unwrap(expRes),
          education: unwrap(eduRes),
          services: unwrap(srvRes),
          profile: unwrap(profileRes),
        });
      } catch (err) {
        console.log('Backend not connected yet or using local defaults:', err);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <div className="space-y-0">
      <Hero profile={data.profile} skills={data.skills} />
      <About profile={data.profile} education={data.education} />
      <Skills skills={data.skills} />
      <Experience experiences={data.experiences} />
      <Projects projects={data.projects} />
      <Services services={data.services} />
      <Contact profile={data.profile} />
    </div>
  );
};

export default Home;
