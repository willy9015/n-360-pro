import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';
import { BottomNav } from '@/components/navigation/BottomNav';

type AppState = 'splash' | 'login' | 'app';
type TabState = 'home' | 'safety' | 'analytics' | 'settings' | 'profile';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState<TabState>('home');

  const handleSplashComplete = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('app');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabState);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'safety':
      case 'analytics':
      case 'settings':
        return (
          <div className="min-h-screen bg-background p-4 pb-20 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {activeTab === 'safety' && 'Control de Seguridad'}
                {activeTab === 'analytics' && 'Análisis y Reportes'}
                {activeTab === 'settings' && 'Configuraciones'}
              </h2>
              <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    case 'login':
      return <Login onLogin={handleLoginSuccess} />;
    case 'app':
      return (
        <>
          {renderTabContent()}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      );
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
};

export default Index;
