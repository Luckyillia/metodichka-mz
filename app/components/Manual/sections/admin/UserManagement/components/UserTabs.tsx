import React from "react"
import type { UserTab } from "../types"

interface UserTabsProps {
    activeTab: UserTab;
    onTabChange: (tab: UserTab) => void;
    counts: {
      active: number;
      inactive: number;
      requests: number;
      moderation?: number;
    };
    showInactiveTab: boolean;
    showRequestsTab: boolean;
    showModerationTab?: boolean;
}

export const UserTabs: React.FC<UserTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  showInactiveTab,
  showRequestsTab,
  showModerationTab = false,
}) => {
  return (
    <div className="flex items-center gap-2 border-b-2 border-border">
      <button
        onClick={() => onTabChange('active')}
        className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
          activeTab === 'active'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        Активные ({counts.active})
      </button>

      {showRequestsTab && (
        <button
          onClick={() => onTabChange('requests')}
          className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
            activeTab === 'requests'
              ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Запросы ({counts.requests})
        </button>
      )}

      {showInactiveTab && (
        <button
          onClick={() => onTabChange('inactive')}
          className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
            activeTab === 'inactive'
              ? 'border-destructive text-destructive'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Неактивные ({counts.inactive})
        </button>
      )}

      {showModerationTab && (
        <button
          onClick={() => onTabChange('moderation')}
          className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
            activeTab === 'moderation'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Модерация аватаров ({counts.moderation || 0})
        </button>
      )}
    </div>
  )
}