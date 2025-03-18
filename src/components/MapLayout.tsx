import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { MapIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface MapLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

const MapLayout = ({ 
  children, 
  sidebar, 
  className 
}: MapLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={cn('flex h-screen w-full overflow-hidden', className)}>
      {/* 侧边栏 */}
      {sidebar && (
        <div 
          className={cn(
            'bg-card border-r transition-all duration-300 ease-in-out overflow-auto',
            sidebarOpen ? 'w-80' : 'w-0'
          )}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                <h1 className="text-xl font-bold">GIS地图</h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebarOpen && sidebar}
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <div className="flex-1 relative">
        {/* 地图内容 */}
        {children}

        {/* 侧边栏切换按钮 */}
        {sidebar && !sidebarOpen && (
          <Button 
            className="absolute top-4 left-4 z-10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 mr-2" />
            打开菜单
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapLayout; 