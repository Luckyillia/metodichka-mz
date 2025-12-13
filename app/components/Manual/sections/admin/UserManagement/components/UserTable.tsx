// app/components/Manual/sections/admin/UserManagement/components/UserTable.tsx (обновлённая)
import React from "react"
import type { User as UserType } from "@/lib/auth/types"
import { CheckCircle, X, AlertCircle, Edit, Shield, Trash2, RotateCcw } from "lucide-react"
import { getRoleBadgeColor, getRoleLabel } from "../utils/userHelpers"

interface UserTableProps {
  users: UserType[]
  currentUser: UserType | null
  onEdit: (user: UserType) => void
  onChangeRole: (user: UserType) => void
  onChangeCity: (user: UserType) => void
  onTransferCity: (user: UserType) => void  // ДОБАВЛЕНО
  onDeactivate: (userId: string, gameNick: string) => void
  onRestore: (userId: string, gameNick: string) => void
  onPermanentDelete: (userId: string, gameNick: string) => void
  onApprove: (userId: string, gameNick: string) => void
  onReject: (userId: string, gameNick: string) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUser,
  onEdit,
  onChangeRole,
  onChangeCity,
  onTransferCity,  // ДОБАВЛЕНО
  onDeactivate,
  onRestore,
  onPermanentDelete,
  onApprove,
  onReject,
}) => {
const canEditUser = (user: UserType): boolean => {
  if (!currentUser) return false
  
  // Root может редактировать всех кроме других root
  if (currentUser.role === "root") {
    return user.role !== "root"
  }
  
  // Admin может редактировать себя и пользователей ниже рангом
  if (currentUser.role === "admin") {
    return currentUser.id === user.id || 
           (user.role !== "admin" && user.role !== "root")
  }
  
  // Лидер может редактировать себя, и user/cc своего города
  if (currentUser.role === "ld") {
    return (currentUser.id === user.id) || 
           ((user.role === "cc" || user.role === "user") && user.city === currentUser.city)
  }
  
  return false
}

const canChangeRole = (user: UserType): boolean => {
  if (!currentUser || currentUser.id === user.id) return false
  
  // Root может изменять роль всем кроме других root
  if (currentUser.role === "root") {
    return user.role !== "root"
  }
  
  // Admin может изменять роль user, cc (не может трогать admin, ld, root)
  if (currentUser.role === "admin") {
    return user.role === "user" || user.role === "cc"
  }
  
  // Лидер может изменять роль между user и cc только в своем городе
  if (currentUser.role === "ld") {
    return (user.role === "user" || user.role === "cc") && 
           user.city === currentUser.city
  }
  
  return false
}

const canDeactivate = (user: UserType): boolean => {
  if (!currentUser || currentUser.id === user.id) return false
  
  // Root может деактивировать всех кроме других root
  if (currentUser.role === "root") {
    return user.role !== "root"
  }
  
  // Admin может деактивировать user, cc (не может трогать admin, ld, root)
  if (currentUser.role === "admin") {
    return user.role === "user" || user.role === "cc"
  }
  
  // Лидер может деактивировать user и cc своего города
  if (currentUser.role === "ld") {
    return (user.role === "cc" || user.role === "user") && 
           user.city === currentUser.city
  }
  
  return false
}

const canApproveRequest = (user: UserType): boolean => {
  if (!currentUser) return false
  
  // Root может одобрять все запросы
  if (currentUser.role === "root") return true
  
  // Admin может одобрять запросы с ролями cc, user, ld
  if (currentUser.role === "admin") {
    return user.role === "cc" || user.role === "user" || user.role === "ld"
  }
  
  // Лидер может одобрять запросы с ролями cc и user своего города
  if (currentUser.role === "ld") {
    return (user.role === "cc" || user.role === "user") && 
           user.city === currentUser.city
  }
  
  return false
}
  return (
    <div className="bg-card/50 rounded-lg border-2 border-border overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Игровой ник
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Логин
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Город
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Дата создания
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-muted/30 transition-colors ${
                  user.status !== "active" ? "opacity-60" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">{user.game_nick}</span>

                    {user.status === "inactive" && (
                      <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                        Деактивирован
                      </span>
                    )}

                    {user.status === "request" && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                        Запрос
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {user.username}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role, user.city)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {user.city === "CGB-N" ? "ЦГБ-Н" : user.city === "CGB-P" ? "ЦГБ-П" : "ОКБ-М"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.status === "active" ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Активен
                    </span>
                  ) : user.status === "request" ? (
                    <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Запрос
                    </span>
                  ) : (
                    <span className="text-destructive flex items-center gap-1">
                      <X className="w-4 h-4" />
                      Неактивен
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString("ru-RU")}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {/* REQUEST ACTIONS */}
                    {user.status === "request" && canApproveRequest(user) && (
                      <>
                        <button
                          onClick={() => onApprove(user.id, user.game_nick)}
                          className="text-green-600 dark:text-green-400 hover:opacity-70 transition-all"
                          title="Одобрить запрос"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => onReject(user.id, user.game_nick)}
                          className="text-destructive hover:opacity-70 transition-all"
                          title="Отклонить запрос"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* ACTIVE USER ACTIONS */}
                    {user.status === "active" && user.role !== "root" && (
                      <>
                        {canEditUser(user) && (
                          <button
                            onClick={() => onEdit(user)}
                            className="text-primary hover:opacity-70 transition-all"
                            title="Редактировать"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        )}

                        {canChangeRole(user) && (
                          <button
                            onClick={() => onChangeRole(user)}
                            className="text-purple-600 dark:text-purple-400 hover:opacity-70 transition-all"
                            title="Изменить роль"
                          >
                            <Shield className="w-5 h-5" />
                          </button>
                        )}

                        {/* КНОПКА ИЗМЕНЕНИЯ ГОРОДА для Root и Admin */}
                        {(currentUser?.role === "root" || currentUser?.role === "admin") && (
                          <button
                            onClick={() => onChangeCity(user)}
                            className="text-blue-600 dark:text-blue-400 hover:opacity-70 transition-all"
                            title="Изменить город"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </button>
                        )}

                        {/* КНОПКА ПЕРЕМЕЩЕНИЯ В ДРУГОЙ ГОРОД для LD (необратимо) */}
                        {currentUser?.role === "ld" && 
                        (user.role === "user" || user.role === "cc") && 
                        user.city === currentUser.city && (
                          <button
                            onClick={() => onTransferCity(user)}
                            className="text-yellow-600 dark:text-yellow-400 hover:opacity-70 transition-all"
                            title="Переместить в другой город (необратимо)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                              <path d="M12 2v8" strokeWidth="3" />
                            </svg>
                          </button>
                        )}

                        {canDeactivate(user) && (
                          <button
                            onClick={() => onDeactivate(user.id, user.game_nick)}
                            className="text-destructive hover:opacity-70 transition-all"
                            title="Деактивировать"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}

                    {/* INACTIVE — ROOT ONLY */}
                    {user.status === "inactive" && currentUser?.role === "root" && (
                      <>
                        <button
                          onClick={() => onRestore(user.id, user.game_nick)}
                          className="text-green-600 dark:text-green-400 hover:opacity-70 transition-all"
                          title="Восстановить"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => onPermanentDelete(user.id, user.game_nick)}
                          className="text-destructive hover:opacity-70 transition-all"
                          title="Удалить окончательно"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}