import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🧬',
      title: 'Sample Management',
      description: 'Track and manage all laboratory samples with real-time status updates and complete traceability.',
      color: '#3b5bdb',
    },
    {
      icon: '📊',
      title: 'Test Analytics',
      description: 'Comprehensive testing workflows with detailed results, quality metrics, and performance insights.',
      color: '#10b981',
    },
    {
      icon: '📦',
      title: 'Inventory Control',
      description: 'Intelligent inventory management with low-stock alerts and automated procurement tracking.',
      color: '#f59e0b',
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Seamless coordination between technicians and departments with role-based access control.',
      color: '#7c3aed',
    },
  ];

  const stats = [
    { label: 'Tests Processed', value: '100K+', icon: '📋' },
    { label: 'Active Users', value: '500+', icon: '👥' },
    { label: 'Uptime', value: '99.9%', icon: '⚡' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fbff', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrollY > 50 ? '0 4px 20px rgba(59, 91, 219, 0.08)' : 'none',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b5bdb' }}>
            🔬 LABOCORE
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#3b5bdb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '120px 2rem 80px',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="fade-in-up"
      >
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
          }}
          className="gradient-text"
        >
          Modern Laboratory Management
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#475569',
            marginBottom: '2rem',
            maxWidth: '600px',
          }}
        >
          Streamline your lab operations with real-time analytics, sample tracking, and comprehensive reporting
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#3b5bdb',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Get Started
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              color: '#3b5bdb',
              border: '2px solid #3b5bdb',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px 2rem',
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#0f172a',
          }}
        >
          Core Features
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: `2px solid ${feature.color}40`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px 2rem',
          background: 'linear-gradient(135deg, #e8ebf8 0%, #f3e8ff 100%)',
          borderRadius: '16px',
          marginBottom: '80px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b5bdb', marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <p style={{ color: '#475569', fontSize: '0.9375rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px 2rem',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: '#0f172a',
          }}
        >
          Ready to Transform Your Lab?
        </h2>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#475569',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
          }}
        >
          Join laboratories worldwide using LABOCORE for efficient sample management and analytics
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          backgroundColor: '#0f172a',
          color: 'white',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        <p>© 2024 LABOCORE. All rights reserved. A modern laboratory management platform.</p>
      </footer>
    </div>
  );
};

export default Landing;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  const features = [
    {
      icon: '🧬',
      title: 'Sample Management',
      description: 'Track and manage all laboratory samples with real-time status updates and complete traceability.',
      color: '#3b5bdb',
    },
    {
      icon: '📊',
      title: 'Test Analytics',
      description: 'Comprehensive testing workflows with detailed results, quality metrics, and performance insights.',
      color: '#10b981',
    },
    {
      icon: '📦',
      title: 'Inventory Control',
      description: 'Intelligent inventory management with low-stock alerts and automated procurement tracking.',
      color: '#f59e0b',
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Seamless coordination between technicians and departments with role-based access control.',
      color: '#7c3aed',
    },
    {
      icon: '⚡',
      title: 'Real-time Dashboards',
      description: 'Instant visibility into laboratory operations with live KPI monitoring and performance analytics.',
      color: '#ef4444',
    },
    {
      icon: '🔐',
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with audit trails, data encryption, and compliance reporting.',
      color: '#06b6d4',
    },
  ];

  const stats = [
    { label: 'Tests Processed', value: '100K+', icon: '📋' },
    { label: 'Active Users', value: '500+', icon: '👥' },
    { label: 'Uptime', value: '99.9%', icon: '⚡' },
    { label: 'Countries', value: '25+', icon: '🌍' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fbff' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .slide-in-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }
        .slide-in-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrollY > 50 ? '0 4px 20px rgba(59, 91, 219, 0.08)' : 'none',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b5bdb' }}>
            🔬 LABOCORE
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 91, 219, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 2rem 2rem',
          background: 'linear-gradient(135deg, #f7fbff 0%, #e8ebf8 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(59, 91, 219, 0.1)',
            top: '10%',
            left: '5%',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.1)',
            bottom: '10%',
            right: '5%',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />

        <div style={{ maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1
            className="fade-in-up"
            style={{
              fontSize: '3.5rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            Transform Your Laboratory <span className="gradient-text">Operations</span>
          </h1>

          <p
            className="fade-in-up"
            style={{
              fontSize: '1.25rem',
              color: '#475569',
              marginBottom: '2rem',
              lineHeight: 1.6,
              animationDelay: '0.1s',
            }}
          >
            LABOCORE is a comprehensive laboratory management system designed to streamline sample processing, optimize workflows, and deliver actionable insights with real-time analytics.
          </p>

          <div className="fade-in-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.2s' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 91, 219, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started
            </button>
            <button
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                border: '2px solid #dce4f0',
                background: 'white',
                color: '#3b5bdb',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b5bdb';
                e.currentTarget.style.backgroundColor = '#e8ebf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#dce4f0';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white', borderTop: '1px solid #dce4f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b5bdb', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#f7fbff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: '#0f172a',
              }}
            >
              Core Features
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to manage your laboratory efficiently and securely
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="fade-in-up"
                style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #dce4f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 91, 219, 0.12)';
                  e.currentTarget.style.borderColor = feature.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#dce4f0';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section style={{ padding: '6rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem', color: '#0f172a' }}>
            Laboratory Workflow
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { step: '01', title: 'Sample Intake', desc: 'Register and track samples' },
              { step: '02', title: 'Processing', desc: 'Automated test workflows' },
              { step: '03', title: 'Analysis', desc: 'Quality validation' },
              { step: '04', title: 'Reporting', desc: 'Generate insights' },
            ].map((item, index) => (
              <div key={index} style={{ flex: 1, minWidth: '200px', textAlign: 'center' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    margin: '0 auto 1rem',
                  }}
                >
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Ready to Transform Your Lab?
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.95 }}>
            Join hundreds of laboratories already using LABOCORE to streamline operations and improve outcomes.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'white',
              color: '#3b5bdb',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          backgroundColor: '#0f172a',
          color: 'white',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        <p>© 2024 LABOCORE. All rights reserved. A modern laboratory management platform.</p>
      </footer>
    </div>
  );
};

export default Landing;
