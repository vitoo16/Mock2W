import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaUserCog,
  FaTasks,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionsRef = useRef([]);
  useEffect(() => {
    setIsVisible(true);

    // Make everything visible immediately to prevent blank page
    document.querySelectorAll(".opacity-0").forEach((el) => {
      el.classList.remove("opacity-0");
    });

    // Simpler, more reliable animation approach
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    // Select all elements that need to be animated
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Add this at the top of your component
  const staggeredDelay = (index, baseDelay = 150) => {
    return `${index * baseDelay}ms`;
  };

  // Avatars for hero section
  const heroAvatars = [
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=64&h=64&facepad=2&q=80",
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=64&h=64&facepad=2&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=64&h=64&facepad=2&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=64&h=64&facepad=2&q=80",
  ]; // Company logos
  const companyLogos = [
    {
      src: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg",
      alt: "Microsoft",
    },
    {
      src: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg",
      alt: "IBM",
    },
    {
      src: "https://www.vectorlogo.zone/logos/google/google-ar21.svg",
      alt: "Google",
    },
    {
      src: "https://www.vectorlogo.zone/logos/spotify/spotify-ar21.svg",
      alt: "Spotify",
    },
    {
      src: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg",
      alt: "Amazon",
    },
    {
      src: "https://www.vectorlogo.zone/logos/slack/slack-ar21.svg",
      alt: "Slack",
    },
  ];
  // Testimonials
  const testimonials = [
    {
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=96&h=96&facepad=2&q=80",
      name: "Alex Thompson",
      role: "Team Lead, TechCorp",
      quote:
        "TaskMaster Pro transformed how our team collaborates. We've reduced meeting times by 40% and everyone knows exactly what they need to work on.",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=96&h=96&facepad=2&q=80",
      name: "Maria Rodriguez",
      role: "Project Manager, DesignHub",
      quote:
        "The intuitive interface and powerful features make TaskMaster Pro the perfect solution for managing our complex projects and deadlines.",
    },
  ];

  return (
    // Changed from animate-fade-in to standard opacity transition for more reliability
    <div className="transition-opacity duration-700 ease-in-out opacity-100">
      {" "}
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-200">
        {/* Background blobs - keeping original colors */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse-slow -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl animate-float -z-10" />
        {/* Two-column hero layout */}
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:space-x-10 lg:space-x-16">
            {" "}
            {/* Left column - Hero content */}
            <div
              className="md:w-1/2 flex flex-col justify-center animate-on-scroll"
              style={{ transitionDelay: "0ms" }}
            >
              <div className="inline-flex items-center bg-blue-100 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
                <span className="animate-pulse mr-2">✨</span>
                <span>Boost your team's productivity</span>
              </div>

              <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl sm:tracking-tight lg:text-6xl leading-tight mb-2">
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Streamline <br /> Your Workflow
                </span>
                <span className="block text-gray-700 text-4xl mt-3">With</span>
                <span className="block text-6xl font-black text-black mt-1">
                  TaskMaster Pro
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-xl">
                The all-in-one task management solution designed to boost your
                productivity and help teams collaborate effectively.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaRocket className="mr-2" /> Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <FaRocket className="mr-2" /> Start Your Schedule
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-lg font-semibold rounded-full shadow-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Learn More
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {heroAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-white transition-transform hover:scale-110 hover:z-10"
                    />
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">4,000+</span>{" "}
                    users joined last month
                  </p>
                  <div className="flex text-yellow-400 text-xs mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 text-sm text-gray-600 opacity-80">
                No credit card required. 30-day free trial.
              </div>
            </div>{" "}
            {/* Right column - Hero banner/image */}
            <div
              className="mt-12 md:mt-0 md:w-1/2 flex items-center justify-center animate-on-scroll"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-40 animate-float -z-10" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-200 rounded-full blur-2xl opacity-30 animate-float -z-10" />
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                    alt="TaskMaster Collaboration"
                    className="w-full h-[400px] object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Trusted by logos slider */}
        <div className="max-w-7xl mx-auto mt-20">
          <p className="text-sm font-medium text-gray-500 text-center mb-6">
            TRUSTED BY FORWARD-THINKING COMPANIES
          </p>
          <div className="relative overflow-hidden py-4 bg-white/30 rounded-xl border border-gray-100 shadow-sm">
            {/* Gradient fade on left */}
            <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
            {/* Logo slider */}
            <div className="flex animate-marquee whitespace-nowrap">
              {[...companyLogos, ...companyLogos].map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center mx-10 transition-all duration-300 hover:scale-110"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-12 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: "140px", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
            {/* Gradient fade on right */}
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-4 py-1 text-sm font-semibold mb-5">
              Features
            </span>
            <h2 className="text-4xl font-bold text-center text-gray-900">
              Powerful Features to Organize Your Work
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage tasks efficiently and boost your
              team's productivity
            </p>
          </div>

          {/* Feature cards with animations */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <FaTasks className="text-5xl group-hover:scale-110 transition-transform duration-200" />
                ),
                title: "Intuitive Task Creation",
                description:
                  "Create and organize tasks with titles, descriptions, priorities, and due dates. Group related tasks into projects for better organization.",
              },
              {
                icon: (
                  <FaUserCog className="text-5xl group-hover:scale-110 transition-transform duration-200" />
                ),
                title: "Smart Task Assignment",
                description:
                  "Assign tasks to team members, set permissions, and monitor progress in real-time. Perfect for team collaboration and project management.",
              },
              {
                icon: (
                  <FaCheckCircle className="text-5xl group-hover:scale-110 transition-transform duration-200" />
                ),
                title: "Efficient Task Management",
                description:
                  "Track task status, set reminders, and receive notifications for upcoming deadlines. Mark tasks as complete and celebrate your productivity wins.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-sky-100 rounded-[2rem] p-8 shadow-md border border-blue-100 transform transition-all duration-300 hover:scale-105 group hover:shadow-lg animate-on-scroll"
                style={{ transitionDelay: staggeredDelay(index) }}
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>{" "}
                <div className="mt-6 flex justify-center">
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block bg-indigo-100 text-indigo-600 rounded-full px-4 py-1 text-sm font-semibold mb-5">
              How It Works
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Simple Process, Powerful Results
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and transform how your team collaborates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-blue-200 z-0"></div>

            {/* Step cards with animations */}
            {[
              {
                num: "01",
                title: "Create Tasks",
                desc: "Quickly create and organize tasks for yourself or your team members.",
                icon: "📝",
              },
              {
                num: "02",
                title: "Assign & Track",
                desc: "Assign tasks to team members and track progress in real-time.",
                icon: "👥",
              },
              {
                num: "03",
                title: "Complete & Report",
                desc: "Mark tasks as complete and generate reports to analyze productivity.",
                icon: "📊",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative z-10 animate-on-scroll"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-6 mx-auto">
                    {step.num}
                  </div>
                  <div className="text-center text-3xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonial/Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-on-scroll">
            <span className="inline-block bg-green-100 text-green-600 rounded-full px-4 py-1 text-sm font-semibold mb-5">
              Trusted by Thousands
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Teams Love TaskMaster Pro
            </h2>
          </div>

          {/* Stat cards with animations */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-10">
            {[
              { stat: "10,000+", label: "Active Users", icon: "👥" },
              { stat: "98%", label: "Task Completion Rate", icon: "✅" },
              { stat: "35%", label: "Productivity Increase", icon: "📈" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-4xl font-bold text-blue-600">{item.stat}</p>
                <p className="text-gray-600 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial cards with animations */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-md text-left group hover:shadow-lg transition-all duration-300 animate-on-scroll"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-2 -left-2 text-4xl opacity-20 rotate-180">
                  ❝
                </div>
                <div className="absolute -bottom-4 -right-2 text-4xl opacity-20">
                  ❞
                </div>
                <div className="flex items-center mb-4 relative z-10">
                  <img
                    src={testimonial.avatar}
                    alt="User"
                    className="w-14 h-14 rounded-full mr-4 shadow"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="group-hover:animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 animate-on-scroll">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
            </Link>
          </div>
        </div>
      </section>
      {/* FAQ Section with interactive accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block bg-purple-100 text-purple-600 rounded-full px-4 py-1 text-sm font-semibold mb-5">
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How do I get started with TaskMaster Pro?",
                a: "Simply create an account, set up your profile, and start creating tasks. You can invite team members to collaborate on projects as needed.",
              },
              {
                q: "Is there a free trial available?",
                a: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to get started.",
              },
              {
                q: "Can I export my task data?",
                a: "Absolutely! You can export your task data in various formats including CSV, Excel, and PDF for your records or reporting needs.",
              },
              {
                q: "How secure is my data?",
                a: "We use industry-standard encryption and security practices to ensure your data remains private and secure at all times.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-gray-50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 animate-on-scroll ${
                  activeAccordion === index ? "shadow-md" : ""
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaQuestionCircle className="text-blue-500 mr-2 flex-shrink-0" />
                    <span>{item.q}</span>
                  </h3>
                  {activeAccordion === index ? (
                    <FaChevronUp className="text-blue-500 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-blue-500 flex-shrink-0" />
                  )}
                </button>{" "}
                <div
                  className={`px-6 pb-6 transition-all duration-300 ${
                    activeAccordion === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <p className="text-gray-600">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-3xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 0V4h-2V0h-4v2h4v4h2V2h4V0h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 animate-on-scroll">
            Ready to boost your productivity?
          </h2>
          <p
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-on-scroll"
            style={{ transitionDelay: "100ms" }}
          >
            Join thousands of satisfied users and transform how your team works
            together.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll"
            style={{ transitionDelay: "200ms" }}
          >
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="px-8 py-4 bg-white text-blue-700 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <span className="mr-2">🚀</span>
              {isAuthenticated ? "Go to Dashboard" : "Start Your Schedule"}
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <span className="mr-2">🔍</span>
              Learn More
            </Link>
          </div>

          <div
            className="mt-10 text-sm text-gray-300 animate-on-scroll"
            style={{ transitionDelay: "300ms" }}
          >
            No credit card required. 30-day free trial.
          </div>
        </div>
      </section>
    </div>
  );
}
