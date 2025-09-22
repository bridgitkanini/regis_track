import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    name: 'Member Management',
    description: 'Comprehensive member directory with detailed profiles and search capabilities.',
    icon: '👥',
  },
  {
    name: 'Activity Tracking',
    description: 'Track member activities, events, and participation in real-time.',
    icon: '📊',
  },
  {
    name: 'Registration System',
    description: 'Streamline member onboarding with customizable registration forms.',
    icon: '📝',
  },
  {
    name: 'Event Management',
    description: 'Plan and organize events with RSVP and attendance tracking.',
    icon: '📅',
  },
  {
    name: 'Reports & Analytics',
    description: 'Generate detailed reports and gain insights into member engagement.',
    icon: '📈',
  },
  {
    name: 'Secure & Private',
    description: 'Enterprise-grade security to protect your member data.',
    icon: '🔒',
  },
];

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/home" className="text-xl font-bold text-primary hover:text-primary/90 transition-colors">
              RegisTrack
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Modern Member Management Solution
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              RegisTrack provides powerful tools for member registration, activity tracking, and engagement—all in one intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Your Free Trial
              </Link>
              <Link
                to="#features"
                className="px-8 py-3 rounded-md text-base font-medium border border-border hover:bg-accent/50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Comprehensive Member Management Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to efficiently manage your member base and track engagement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join organizations of all sizes using RegisTrack to streamline their member management.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/home" className="text-lg font-bold text-primary">
                RegisTrack
              </Link>
              <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} RegisTrack. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
