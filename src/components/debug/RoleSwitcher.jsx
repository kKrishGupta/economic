import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { ShieldAlert } from 'lucide-react';

const ROLES = ['VISITOR', 'OPERATOR', 'SAFETY_OFFICER', 'PLANT_MANAGER', 'ADMIN'];

export function RoleSwitcher() {
  const { user, updateRole } = useAuth();

  if (!user) return null;

  return (
    <div className="relative group flex items-center">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 cursor-pointer">
        <ShieldAlert className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary">{user.role}</span>
      </div>
      
      {/* Dropdown menu */}
      <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-1">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase border-b">
            Switch Role (Debug)
          </div>
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => updateRole(role)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${user.role === role ? 'font-bold text-primary' : ''}`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
