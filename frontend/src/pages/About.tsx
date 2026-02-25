import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Github, Linkedin, Mail, ExternalLink, Code2, Brain,
  Database, Layout, Globe, Shield, Smartphone, Palette,
  ChevronRight, ArrowRight, Sparkles, Terminal, Cpu,
  GraduationCap, Trophy, Users, Zap, Heart, MapPin
} from "lucide-react";

/* ─── Typewriter Hook ─── */
const useTypewriter = (words: string[], speed = 120, pause = 2000) => {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setText(current.slice(0, charIdx));
        if (charIdx === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % words.length);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return text;
};

/* ─── Animated count-up ─── */
const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count}{suffix}</div>;
};

/* ─── Fade-in on scroll ─── */
const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           ABOUT / PORTFOLIO PAGE                          */
/* ═══════════════════════════════════════════════════════════════════════════ */

const About = () => {
  const typedText = useTypewriter([
    "Web Developer",
    "AI Enthusiast",
    "Creative Designer",
    "Problem Solver",
    "Full-Stack Builder",
  ]);

  const skills = [
    { icon: Code2,    title: "Programming",   items: ["Python", "JavaScript", "SQL"], color: "#c9a84c" },
    { icon: Layout,   title: "Web Dev",        items: ["HTML", "CSS", "React", "Node.js"], color: "#fc8019" },
    { icon: Database, title: "Databases",      items: ["MySQL", "MongoDB", "Firebase"], color: "#10b981" },
    { icon: Brain,    title: "AI & ML",        items: ["Machine Learning", "Voice Interfaces", "Computer Vision"], color: "#8b5cf6" },
    { icon: Globe,    title: "Web Design",     items: ["Responsive Design", "Creative UI", "UX Principles"], color: "#e23744" },
    { icon: Shield,   title: "CS Fundamentals",items: ["Operating Systems", "DBMS", "Networking"], color: "#0ea5e9" },
  ];

  const projects = [
    {
      title: "AI Healthcare Assistant",
      desc: "Voice-controlled healthcare app with face recognition and real-time health data integration for patients and care providers.",
      tags: ["Python", "AI", "OpenCV", "Speech Recognition"],
      gradient: "from-[#c9a84c]/20 to-[#8b6914]/5",
    },
    {
      title: "Offline Medical Emergency AI",
      desc: "Works without internet, SIM, or external power — a life-saving AI assistant for medical emergencies in remote areas.",
      tags: ["Edge AI", "LLM", "React", "Offline-First"],
      gradient: "from-[#e23744]/20 to-[#b02030]/5",
    },
    {
      title: "SafeFactory AI",
      desc: "Smart surveillance and safety monitoring system for industries — detects hazards and alerts workers in real-time.",
      tags: ["Computer Vision", "Python", "IoT", "Alerts"],
      gradient: "from-[#10b981]/20 to-[#047857]/5",
    },
    {
      title: "Amazon AccessMate",
      desc: "Inclusive shopping assistant prototype designed for accessibility — making e-commerce workflows usable for everyone.",
      tags: ["Accessibility", "Web Dev", "UX Research"],
      gradient: "from-[#8b5cf6]/20 to-[#6d28d9]/5",
    },
    {
      title: "FoodExpress — Online Ordering",
      desc: "Full-stack food ordering platform with real-time tracking, multi-role dashboards, and payment integration.",
      tags: ["React", "Flask", "MySQL", "Firebase Auth"],
      gradient: "from-[#fc8019]/20 to-[#c05c00]/5",
    },
    {
      title: "Personal Portfolio Website",
      desc: "Responsive portfolio with animated sections, smooth scrolling, and modern Roboto Mono typography.",
      tags: ["HTML", "CSS", "JavaScript", "Design"],
      gradient: "from-[#0ea5e9]/20 to-[#0284c7]/5",
    },
  ];

  const services = [
    { icon: Globe,       title: "Web Development",   desc: "Building robust, scalable websites tailored to your needs." },
    { icon: Smartphone,  title: "Responsive Design",  desc: "Pixel-perfect interfaces that look great on every device." },
    { icon: Palette,     title: "Creative Design",     desc: "Innovative, visually appealing solutions that bring ideas to life." },
    { icon: Cpu,         title: "AI Integration",      desc: "Embedding intelligent features — voice, vision, and smart data." },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#c9a84c] selection:text-black overflow-hidden">
      <Header />

      {/* ════════════════════════  HERO  ════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c9a84c]/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "6s" }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="container relative z-10 text-center px-4">
          {/* Code-style intro */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 mb-8">
              <Terminal className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-sm font-mono text-[#c9a84c] tracking-wide">Hello, World! 👋</span>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-6">
              I'm{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] via-[#f0c060] to-[#c9a84c]">
                  Abdul Waheed A
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#c9a84c] to-transparent rounded-full" />
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="text-xl sm:text-2xl md:text-3xl font-light text-gray-400 mb-4 h-10">
              <span className="text-[#c9a84c] font-semibold">{typedText}</span>
              <span className="animate-pulse text-[#c9a84c] ml-0.5">|</span>
            </div>
          </FadeIn>

          <FadeIn delay={450}>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Computer Science student & AI enthusiast focused on building real-world solutions
              in <span className="text-white font-medium">healthcare</span>,{" "}
              <span className="text-white font-medium">safety</span>, and{" "}
              <span className="text-white font-medium">accessibility</span>.
              Passionate about using technology to create meaningful impact.
            </p>
          </FadeIn>

          <FadeIn delay={600}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/Dx-abdul-16"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-white/10"
              >
                <Github className="w-5 h-5" />
                GitHub
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/waheed-a-/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0077b5] text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#0077b5]/20"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </a>
              <a
                href="https://dx-abdul-16.github.io/portfolio/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full border-2 border-[#c9a84c] text-[#c9a84c] font-bold text-sm hover:bg-[#c9a84c] hover:text-black transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Portfolio
              </a>
            </div>
          </FadeIn>

          {/* Scroll indicator */}
          <FadeIn delay={800}>
            <div className="mt-16 flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: "2s" }}>
              <span className="text-xs text-gray-600 uppercase tracking-widest">Scroll Down</span>
              <div className="w-5 h-8 rounded-full border-2 border-gray-700 flex items-start justify-center p-1">
                <div className="w-1 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════  STATS BAR  ════════════════════ */}
      <section className="relative border-y border-[#1e1e1e] bg-[#0d0d0d]">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 10, suffix: "+", label: "Projects Built" },
              { value: 6, suffix: "+", label: "Tech Skills" },
              { value: 3, suffix: "+", label: "Hackathons" },
              { value: 100, suffix: "%", label: "Dedication" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-black text-[#c9a84c] mb-2">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════  ABOUT ME  ════════════════════ */}
      <section className="py-24 relative" id="about">
        <div className="container px-4">
          <FadeIn>
            <div className="flex items-center gap-4 mb-14">
              <Sparkles className="w-6 h-6 text-[#c9a84c]" />
              <h2 className="text-3xl md:text-4xl font-black">
                About <span className="text-[#c9a84c]">Abdul Waheed A</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#c9a84c]/30 to-transparent" />
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left — 3 cols */}
            <FadeIn className="lg:col-span-3">
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-light">
                <p>
                  I am <span className="text-white font-semibold">Abdul Waheed A</span>, a passionate web developer
                  and designer with a keen eye for creativity and innovation. Currently pursuing my degree in{" "}
                  <span className="text-[#c9a84c] font-medium">Bachelor of Computer Applications (B.C.A)</span> at KG College of Arts and Science, I am dedicated to honing my
                  skills and delivering exceptional digital experiences.
                </p>
                <p>
                  I actively participate in <span className="text-white font-medium">hackathons</span>, team projects,
                  and technology events, demonstrating strong teamwork, creativity, and leadership skills. I have built
                  multiple innovative projects including AI-based healthcare assistants, offline emergency AI systems,
                  industrial safety monitors, and full-stack web applications.
                </p>
                <p>
                  I believe in living life with purpose and embracing every opportunity to grow and create meaningful
                  work. As a fast learner, I enjoy building impactful solutions that improve{" "}
                  <span className="text-[#c9a84c]">healthcare</span>,{" "}
                  <span className="text-[#c9a84c]">safety</span>, and{" "}
                  <span className="text-[#c9a84c]">accessibility</span> using modern technology.
                </p>
              </div>
            </FadeIn>

            {/* Right — 2 cols: quick facts */}
            <FadeIn delay={200} className="lg:col-span-2">
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#111111] p-8 space-y-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#c9a84c]" /> Quick Facts
                </h3>
                {[
                  { icon: GraduationCap, label: "B.C.A — Computer Applications" },
                  { icon: MapPin, label: "India" },
                  { icon: Heart, label: "AI, Web Dev & Design" },
                  { icon: Users, label: "Team Player & Leader" },
                  { icon: Trophy, label: "Hackathon Winner" },
                  { icon: Code2, label: "Python • JS • React • SQL" },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 group-hover:bg-[#c9a84c]/20 transition-colors">
                      <Icon className="w-4 h-4 text-[#c9a84c]" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════  SERVICES  ════════════════════ */}
      <section className="py-24 bg-[#0d0d0d] border-y border-[#1e1e1e]">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c9a84c] mb-3 block">What I Do</span>
              <h2 className="text-3xl md:text-4xl font-black">
                My <span className="text-[#c9a84c]">Services</span>
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                Choose from a variety of services tailored to meet your needs — from web development to AI solutions.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="group relative p-8 rounded-3xl border border-[#2a2a2a] bg-[#111111] hover:border-[#c9a84c]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <s.icon className="w-10 h-10 text-[#c9a84c] mb-5 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════  SKILLS  ════════════════════ */}
      <section className="py-24">
        <div className="container px-4">
          <FadeIn>
            <div className="flex items-center gap-4 mb-14">
              <h2 className="text-3xl md:text-4xl font-black">
                Technical <span className="text-[#c9a84c]">Skills</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#c9a84c]/30 to-transparent" />
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="group relative p-7 rounded-3xl border border-[#2a2a2a] bg-[#111111] hover:border-opacity-50 transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${skill.color}20` }}>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${skill.color}15`, border: `1px solid ${skill.color}30` }}
                    >
                      <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                    </div>
                    <h3 className="text-lg font-bold">{skill.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map(item => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                        style={{
                          borderColor: `${skill.color}25`,
                          color: skill.color,
                          backgroundColor: `${skill.color}08`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════  PROJECTS  ════════════════════ */}
      <section className="py-24 bg-[#0d0d0d] border-y border-[#1e1e1e]">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c9a84c] mb-3 block">Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-black">
                Featured <span className="text-[#c9a84c]">Projects</span>
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                Explore my projects showcasing a variety of innovative works across AI, web, and design.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className={`group relative p-7 rounded-3xl border border-[#2a2a2a] bg-gradient-to-br ${project.gradient} hover:border-[#c9a84c]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 flex flex-col h-full`}>
                  {/* Number */}
                  <span className="absolute top-5 right-6 text-6xl font-black text-white/[0.03] select-none leading-none">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#c9a84c] transition-colors pr-10">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-[#0a0a0a]/60 border border-[#333] rounded-full text-[11px] text-gray-300 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════  EDUCATION & ACHIEVEMENTS  ════════════════════ */}
      <section className="py-24">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Education */}
            <FadeIn>
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <GraduationCap className="w-6 h-6 text-[#c9a84c]" />
                  <h2 className="text-3xl font-black">Education</h2>
                </div>
                <div className="relative pl-8 border-l-2 border-[#2a2a2a] space-y-10">
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/30" />
                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6">
                      <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider">2023 – 2026 · Ongoing</span>
                      <h3 className="text-xl font-bold mt-2">B.C.A — Bachelor of Computer Applications</h3>
                      <p className="text-[#c9a84c] mt-1 font-medium text-sm">KG College of Arts and Science</p>
                      <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                        Specializing in AI, software development, and real-world problem solving.
                        Building innovative projects that merge technology with impact.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#333]" />
                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Previous</span>
                      <h3 className="text-xl font-bold mt-2">Higher Secondary Education</h3>
                      <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                        Built a strong foundation in mathematics, science, and computer science fundamentals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Achievements */}
            <FadeIn delay={200}>
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <Trophy className="w-6 h-6 text-[#c9a84c]" />
                  <h2 className="text-3xl font-black">Achievements</h2>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      emoji: "🏆",
                      title: "Hackathon Winner",
                      desc: "Built the award-winning SafeFactory AI solution — smart industrial safety monitoring."
                    },
                    {
                      emoji: "🏅",
                      title: "AI Innovation Award",
                      desc: "Recognized for the Offline Medical Emergency AI Assistant — works without internet or power."
                    },
                    {
                      emoji: "⭐",
                      title: "Open Source Contributor",
                      desc: "Active GitHub contributor, continuous learner, and tech community participant."
                    },
                    {
                      emoji: "👥",
                      title: "Team Leadership",
                      desc: "Led multiple cross-functional teams in hackathons and semester projects."
                    },
                  ].map((a, i) => (
                    <div key={i} className="group flex gap-5 p-6 rounded-2xl border border-[#2a2a2a] bg-[#111111] hover:border-[#c9a84c]/30 transition-all">
                      <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{a.emoji}</span>
                      <div>
                        <h3 className="font-bold text-base mb-1.5">{a.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════  CONTACT CTA  ════════════════════ */}
      <section className="relative py-28 border-t border-[#1e1e1e] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c]/10 rounded-full blur-[160px]" />
        </div>
        <div className="container relative z-10 text-center px-4">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c9a84c] mb-3 block">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Let's Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#f0c060]">Great</span>
              .
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              I'm always open to new opportunities and collaborations.
              Whether you have a project idea or just want to say hi — let's connect!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:abdulwaheed.dev@gmail.com"
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b8943d] text-black font-black text-base hover:scale-105 transition-all shadow-xl shadow-[#c9a84c]/20"
              >
                <Mail className="w-5 h-5" />
                Say Hello
                <ChevronRight className="w-5 h-5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </a>
              <a
                href="https://github.com/Dx-abdul-16"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 border-[#2a2a2a] text-white font-bold text-base hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all"
              >
                <Github className="w-5 h-5" />
                Check My Profile
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════  FOOTER CREDITS  ════════════════════ */}
      <div className="bg-[#080808] border-t border-[#1e1e1e] py-6 text-center">
        <p className="text-xs text-gray-600">
          All Rights Reserved. © {new Date().getFullYear()}{" "}
          <a href="https://dx-abdul-16.github.io/portfolio/" target="_blank" rel="noreferrer" className="text-[#c9a84c] hover:underline font-semibold">
            ABDUL WAHEED A
          </a>
          {" "}— Designed & Developed with <span className="text-red-500">❤</span>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default About;
