import React, { useEffect, useState } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthService } from '@/lib/auth/auth-service';

interface Task {
  id: number;
  task: string;
  max: number | string;
  points: number | string;
}

interface Department {
  id: string | number;
  name: string;
  subtitle: string;
  color: string;
  tasks: Task[];
}

interface ReprimandSystem {
  id: string | number;
  title: string;
  subtitle: string;
  color: string;
  tasks: Task[];
}

interface EditingCell {
  type: 'promotion' | 'reprimand';
  deptId: string | number;
  taskId: number;
  field: string;
}

const PromotionSystem = () => {
  const { user } = useAuth();
  const canEdit = !!user && (user.role === 'admin' || user.role === 'root');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [reprimandSystems, setReprimandSystems] = useState<ReprimandSystem[]>([]);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState<string>('pmu');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await AuthService.getPromotionSystem();
        const promotions = (data?.promotions || []) as any[];
        const reprimands = (data?.reprimands || []) as any[];

        if (promotions.length > 0) {
          setDepartments(
            promotions.map((p) => ({
              id: p.id,
              name: p.name,
              subtitle: p.subtitle,
              color: p.color,
              tasks: p.tasks || [],
            }))
          );
        }

        if (reprimands.length > 0) {
          setReprimandSystems(
            reprimands.map((r) => ({
              id: r.id,
              title: r.title,
              subtitle: r.subtitle,
              color: r.color,
              tasks: r.tasks || [],
            }))
          );
        }
      } catch (e) {
        console.error('[PromotionSystem] load error', e);
      }
    };

    load();
  }, []);

  const startEdit = (type: 'promotion' | 'reprimand', deptId: string | number, taskId: number, field: string, value: any) => {
    if (!canEdit) return;
    setEditingCell({ type, deptId, taskId, field });
    setEditValue(String(value ?? ''));
  };

  const saveEdit = async () => {
    if (!editingCell || !canEdit) return;

    try {
      await AuthService.updatePromotionTask(
        String(editingCell.deptId),
        editingCell.taskId,
        editingCell.field as 'task' | 'max' | 'points',
        String(editValue)
      );
    } catch (e) {
      console.error('[PromotionSystem] save error', e);
    }

    if (editingCell.type === 'promotion') {
      setDepartments((deps) =>
        deps.map((dept) => {
          if (dept.id === editingCell.deptId) {
            return {
              ...dept,
              tasks: dept.tasks.map((task) => {
                if (task.id === editingCell.taskId) {
                  return { ...task, [editingCell.field]: editValue };
                }
                return task;
              }),
            };
          }
          return dept;
        })
      );
    } else if (editingCell.type === 'reprimand') {
      setReprimandSystems((systems) =>
        systems.map((system) => {
          if (system.id === editingCell.deptId) {
            return {
              ...system,
              tasks: system.tasks.map((task) => {
                if (task.id === editingCell.taskId) {
                  return { ...task, [editingCell.field]: editValue };
                }
                return task;
              }),
            };
          }
          return system;
        })
      );
    }

    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const addTask = async (type: 'promotion' | 'reprimand', deptId: string | number) => {
    if (!canEdit) return;

    try {
      const inserted = await AuthService.addPromotionTask(String(deptId), 'Новое задание', '1', '1');

      if (type === 'promotion') {
        setDepartments((deps) =>
          deps.map((dept) => {
            if (dept.id === deptId) {
              return {
                ...dept,
                tasks: [...dept.tasks, { id: inserted.id, task: inserted.task, max: inserted.max, points: inserted.points }],
              };
            }
            return dept;
          })
        );
      } else if (type === 'reprimand') {
        setReprimandSystems((systems) =>
          systems.map((system) => {
            if (system.id === deptId) {
              return {
                ...system,
                tasks: [...system.tasks, { id: inserted.id, task: inserted.task, max: inserted.max, points: inserted.points }],
              };
            }
            return system;
          })
        );
      }
    } catch (e) {
      console.error('[PromotionSystem] add error', e);
    }
  };

  const deleteTask = async (type: 'promotion' | 'reprimand', deptId: string | number, taskId: number) => {
    if (!canEdit) return;

    try {
      await AuthService.deletePromotionTask(taskId);
    } catch (e) {
      console.error('[PromotionSystem] delete error', e);
    }

    if (type === 'promotion') {
      setDepartments((deps) =>
        deps.map((dept) => {
          if (dept.id === deptId) {
            return {
              ...dept,
              tasks: dept.tasks.filter((task) => task.id !== taskId),
            };
          }
          return dept;
        })
      );
    } else if (type === 'reprimand') {
      setReprimandSystems((systems) =>
        systems.map((system) => {
          if (system.id === deptId) {
            return {
              ...system,
              tasks: system.tasks.filter((task) => task.id !== taskId),
            };
          }
          return system;
        })
      );
    }
  };

  const renderTable = (data: Department | (ReprimandSystem & { name?: string }), type: 'promotion' | 'reprimand') => (
    <div className="mb-8 bg-card/50 rounded-lg shadow-md border border-border overflow-hidden">
      <div className={`${data.color} text-white p-4`}>
        <h2 className="text-lg font-bold">{(data as Department).name || (data as ReprimandSystem).title}</h2>
        <p className="text-sm font-semibold text-white/90">{data.subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground">
              <th className="px-4 py-2 text-left text-xs font-medium border-b border-border">Задание</th>
              <th className="px-4 py-2 text-center text-xs font-medium border-b border-border w-40">Макс. кол-во выполнений</th>
              <th className="px-4 py-2 text-center text-xs font-medium border-b border-border w-28">Баллы</th>
              <th className="px-4 py-2 text-center text-xs font-medium border-b border-border w-20">Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks.map((task, idx) => (
              <tr key={task.id} className={`${idx % 2 === 0 ? 'bg-background/20' : 'bg-background/40'} hover:bg-accent/10 transition-colors`}>
                <td className="px-4 py-2 text-sm text-foreground border-b border-border">
                  {editingCell?.type === type && editingCell?.deptId === data.id && editingCell?.taskId === task.id && editingCell?.field === 'task' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 bg-input border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={saveEdit} className="p-1.5 bg-primary hover:bg-primary/80 rounded text-primary-foreground">
                        <Save size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 bg-destructive hover:bg-destructive/80 rounded text-destructive-foreground">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={canEdit ? () => startEdit(type, data.id, task.id, 'task', task.task) : undefined}
                      className={`cursor-pointer hover:bg-accent/10 px-2 py-1 rounded transition-colors flex items-center justify-between group ${canEdit ? '' : 'opacity-50'}`}
                    >
                      <span>{task.task}</span>
                      {canEdit && <Edit2 size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-foreground text-center border-b border-border">
                  {editingCell?.type === type && editingCell?.deptId === data.id && editingCell?.taskId === task.id && editingCell?.field === 'max' ? (
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-28 px-2 py-1 bg-input border border-border rounded text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={saveEdit} className="p-1.5 bg-primary hover:bg-primary/80 rounded text-primary-foreground">
                        <Save size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 bg-destructive hover:bg-destructive/80 rounded text-destructive-foreground">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={canEdit ? () => startEdit(type, data.id, task.id, 'max', task.max) : undefined}
                      className={`px-2 py-1 rounded transition-colors inline-flex items-center gap-2 group ${canEdit ? 'cursor-pointer hover:bg-accent/10' : 'opacity-50'}`}
                    >
                      <span>{task.max}</span>
                      {canEdit && <Edit2 size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-foreground text-center font-semibold border-b border-border">
                  {editingCell?.type === type && editingCell?.deptId === data.id && editingCell?.taskId === task.id && editingCell?.field === 'points' ? (
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 px-2 py-1 bg-input border border-border rounded text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={saveEdit} className="p-1.5 bg-primary hover:bg-primary/80 rounded text-primary-foreground">
                        <Save size={14} />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 bg-destructive hover:bg-destructive/80 rounded text-destructive-foreground">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={canEdit ? () => startEdit(type, data.id, task.id, 'points', task.points) : undefined}
                      className={`px-2 py-1 rounded transition-colors inline-flex items-center gap-2 group ${canEdit ? 'cursor-pointer hover:bg-accent/10' : 'opacity-50'}`}
                    >
                      <span className="text-primary">{task.points}</span>
                      {canEdit && <Edit2 size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-center border-b border-border">
                  {canEdit && (
                    <button
                      onClick={() => deleteTask(type, data.id, task.id)}
                      className="p-1.5 bg-destructive/80 hover:bg-destructive rounded text-destructive-foreground transition-colors"
                      title="Удалить задание"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <div className="p-2 bg-background/20 border-t border-border">
          <button
            onClick={() => addTask(type, data.id)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/80 rounded text-primary-foreground text-xs font-medium transition-colors"
          >
            <Plus size={16} />
            Добавить задание
          </button>
        </div>
      )}
    </div>
  );

  const allSections = [
    ...departments.map((d) => ({ ...d, type: 'promotion' as const, key: d.id, label: d.name })),
    ...reprimandSystems.map((r) => ({ ...r, type: 'reprimand' as const, key: r.id, label: r.title }))
  ];

  const tabOrder = ['pmu', 'old', 'oth', 'rep_1_7', 'rep_lead'];
  const tabs = tabOrder
    .map((key) => {
      const section = allSections.find((s) => s.key === key);
      return section ? { key, label: section.label } : null;
    })
    .filter((t): t is { key: string; label: string } => !!t);

  const currentSection = allSections.find((s) => s.key === activeTab);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentSection && renderTable(currentSection, currentSection.type)}
    </div>
  );
};

export default PromotionSystem;