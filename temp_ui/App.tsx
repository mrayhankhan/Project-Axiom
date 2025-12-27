import React, { useState } from 'react';
import { Sidebar, MobileSidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/screens/Dashboard';
import { Documents } from './components/screens/Documents';
import { QA } from './components/screens/QA';
import { Analytics } from './components/screens/Analytics';
import { Risk } from './components/screens/Risk';
import { Evaluation } from './components/screens/Evaluation';
import { Users } from './components/screens/Users';
import { Settings } from './components/screens/Settings';
import { Infrastructure } from './components/screens/Infrastructure';
import './styles/globals.css';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const screenTitles: { [key: string]: { title: string; breadcrumbs?: string[] } } = {
    dashboard: { title: 'Dashboard' },
    qa: { title: 'Intelligence Q&A', breadcrumbs: ['Intelligence', 'Q&A'] },
    documents: { title: 'Documents', breadcrumbs: ['Intelligence', 'Documents'] },
    analytics: { title: 'Analytics', breadcrumbs: ['Analysis', 'Analytics'] },
    risk: { title: 'Risk Management', breadcrumbs: ['Analysis', 'Risk'] },
    evaluation: { title: 'Model Evaluation', breadcrumbs: ['Analysis', 'Evaluation'] },
    users: { title: 'Users & Roles', breadcrumbs: ['Management', 'Users & Roles'] },
    settings: { title: 'Settings', breadcrumbs: ['Management', 'Settings'] },
    infrastructure: { title: 'Infrastructure', breadcrumbs: ['Management', 'Infrastructure'] },
    help: { title: 'Help & Documentation', breadcrumbs: ['Help'] }
  };
  
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'qa':
        return <QA />;
      case 'documents':
        return <Documents />;
      case 'analytics':
        return <Analytics />;
      case 'risk':
        return <Risk />;
      case 'evaluation':
        return <Evaluation />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'infrastructure':
        return <Infrastructure />;
      case 'help':
        return <HelpScreen />;
      default:
        return <Dashboard />;
    }
  };
  
  const currentScreen = screenTitles[activeScreen] || screenTitles.dashboard;
  
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeItem={activeScreen}
          onNavigate={setActiveScreen}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar
        activeItem={activeScreen}
        onNavigate={setActiveScreen}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title={currentScreen.title}
          breadcrumbs={currentScreen.breadcrumbs}
          onMenuClick={() => setMobileSidebarOpen(true)}
          environmentTag="prod"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 lg:px-6 py-6 max-w-[1600px]">
            {renderScreen()}
          </div>
        </main>
      </div>
    </div>
  );
}

function HelpScreen() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Help & Documentation</h2>
        <p className="text-neutral-600 mb-6">
          Welcome to Axiom - your Enterprise Model Risk & Explainability Intelligence Platform.
          Find guides, tutorials, and support resources below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HelpCard
            title="Getting Started"
            description="Learn the basics of Axiom and set up your first workflow"
            topics={['Quick start guide', 'Upload documents', 'Run your first query', 'Invite team members']}
          />
          <HelpCard
            title="Document Management"
            description="Organize and manage your knowledge base"
            topics={['Upload documents', 'Configure ingestion', 'Manage tags', 'Vector indexing']}
          />
          <HelpCard
            title="Intelligence Q&A"
            description="Ask questions and get insights from your documents"
            topics={['Query best practices', 'Retrieval settings', 'Source provenance', 'Explainability']}
          />
          <HelpCard
            title="Risk Management"
            description="Monitor and manage model risk"
            topics={['Create incidents', 'Risk policies', 'Compliance tracking', 'Risk matrix']}
          />
          <HelpCard
            title="Model Evaluation"
            description="Test and evaluate model performance"
            topics={['Create evaluations', 'Test datasets', 'Metrics explained', 'Compare runs']}
          />
          <HelpCard
            title="API & Integrations"
            description="Connect Axiom to your systems"
            topics={['API documentation', 'Authentication', 'Webhooks', 'Data connectors']}
          />
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-4">Need More Help?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-900 transition-colors">
              Contact Support
            </button>
            <button className="px-4 py-2 border border-neutral-300 text-neutral-900 rounded-md hover:bg-neutral-50 transition-colors">
              View Full Documentation
            </button>
            <button className="px-4 py-2 border border-neutral-300 text-neutral-900 rounded-md hover:bg-neutral-50 transition-colors">
              Community Forum
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-2">Keyboard Shortcuts</h3>
        <p className="text-sm text-neutral-600 mb-4">Press <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">?</kbd> to view all keyboard shortcuts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Global search</span>
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">Ctrl + K</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">New document</span>
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">Ctrl + U</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">New evaluation</span>
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">Ctrl + E</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Settings</span>
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">Ctrl + ,</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpCard({ title, description, topics }: { title: string; description: string; topics: string[] }) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
      <h4 className="font-semibold text-neutral-900 mb-2">{title}</h4>
      <p className="text-sm text-neutral-600 mb-3">{description}</p>
      <ul className="space-y-1.5">
        {topics.map((topic, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-900">
            <span>→</span>
            <span>{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
