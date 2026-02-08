import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit2, Save, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthService } from '@/lib/auth/auth-service';
import "@/app/styles/parkingSpaces.css";

interface ParkingData {
    id: number;
    place: number;
    person: string;
    car: string;
    license: string;
    category: string;
    updated_at?: string;
    updated_by?: string;
}

interface TableSectionProps {
    title: string;
    data: ParkingData[];
    headerClass: string;
    canEdit: boolean;
    onEdit: (place: number) => void;
    onSave: (place: number) => void;
    onCancel: (place: number) => void;
    editingPlace: number | null;
    isSaving: boolean;
    personRef: React.RefObject<HTMLInputElement>;
    carRef: React.RefObject<HTMLInputElement>;
    licenseRef: React.RefObject<HTMLInputElement>;
}

const ParkingSpaces = () => {
    const { user } = useAuth();
    const [parkingData, setParkingData] = useState<ParkingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPlace, setEditingPlace] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const personRef = useRef<HTMLInputElement>(null);
    const carRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);

    // Проверка прав на редактирование
    const canEdit = user && ['root', 'admin', 'ld', 'cc'].includes(user.role);

    const fetchParkingData = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log('[ParkingSpaces] Fetching parking data...');
            const spaces = await AuthService.getParkingSpaces();
            console.log('[ParkingSpaces] Fetched spaces:', spaces?.length || 0);
            setParkingData(spaces);
        } catch (error) {
            console.error('[ParkingSpaces] Error fetching parking data:', error);
            showNotification('error', 'Ошибка при загрузке данных');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Загрузка данных
    useEffect(() => {
        fetchParkingData();
    }, [fetchParkingData]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleEdit = (place: number) => {
        console.log('[ParkingSpaces] Editing place:', place);
        setEditingPlace(place);
        setTimeout(() => {
            if (personRef.current) {
                personRef.current.focus({ preventScroll: true });
            }
        }, 0);
    };

    const handleSave = async (place: number) => {
        const person = personRef.current?.value.trim() || '';
        const car = carRef.current?.value.trim() || '';
        const license = licenseRef.current?.value.trim() || '';

        console.log('[ParkingSpaces] Saving place:', place, { person, car, license });

        if (!person || !car || !license) {
            showNotification('error', 'Все поля должны быть заполнены');
            return;
        }

        try {
            setIsSaving(true);
            console.log('[ParkingSpaces] Calling updateParkingSpace...');

            const updatedSpace = await AuthService.updateParkingSpace(
                place,
                person,
                car,
                license
            );

            console.log('[ParkingSpaces] Update successful:', updatedSpace);

            // Обновляем состояние с новыми данными
            setParkingData(prev =>
                prev.map(s => (s.place === place ? { ...s, ...updatedSpace } : s))
            );
            setEditingPlace(null);
            showNotification('success', `Место №${place} успешно обновлено`);
        } catch (error: any) {
            console.error('[ParkingSpaces] Error saving parking space:', error);
            const errorMessage = error?.message || 'Неизвестная ошибка';
            showNotification('error', `Ошибка: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        console.log('[ParkingSpaces] Canceling edit');
        setEditingPlace(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent, place: number) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const TableSection: React.FC<TableSectionProps> = ({
                                                           title,
                                                           data,
                                                           headerClass,
                                                           canEdit,
                                                           onEdit,
                                                           onSave,
                                                           onCancel,
                                                           editingPlace,
                                                           isSaving,
                                                           personRef,
                                                           carRef,
                                                           licenseRef,
                                                       }) => (
        <table className="parking-section-table">
            <thead>
            <tr className={`parking-section-header ${headerClass}`}>
                <td colSpan={canEdit ? 5 : 4}>{title}</td>
            </tr>
            <tr>
                <th>№ места</th>
                <th>Сотрудник</th>
                <th>Автомобиль</th>
                <th>Гос. номер</th>
                {canEdit && <th style={{ width: '120px' }}>Действие</th>}
            </tr>
            </thead>
            <tbody>
            {data.map((row) => {
                const isEditing = editingPlace === row.place;
                const isOccupied = row.person !== '-';

                return (
                    <tr
                        key={row.place}
                        className={`${isOccupied ? 'occupied' : ''} ${isEditing ? 'editing' : ''}`}
                    >
                        <td className="parking-place-number">{row.place}</td>
                        <td className="parking-person-name">
                            {isEditing ? (
                                <input
                                    ref={personRef}
                                    type="text"
                                    defaultValue={row.person}
                                    onKeyDown={(e) => handleKeyPress(e, row.place)}
                                    className="edit-input"
                                    placeholder="Имя сотрудника"
                                    disabled={isSaving}
                                />
                            ) : (
                                row.person
                            )}
                        </td>
                        <td className="parking-car-model">
                            {isEditing ? (
                                <input
                                    ref={carRef}
                                    type="text"
                                    defaultValue={row.car}
                                    onKeyDown={(e) => handleKeyPress(e, row.place)}
                                    className="edit-input"
                                    placeholder="Модель автомобиля"
                                    disabled={isSaving}
                                />
                            ) : (
                                row.car
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <input
                                    ref={licenseRef}
                                    type="text"
                                    defaultValue={row.license}
                                    onKeyDown={(e) => handleKeyPress(e, row.place)}
                                    className="edit-input"
                                    placeholder="Гос. номер"
                                    disabled={isSaving}
                                />
                            ) : (
                                <span className="parking-license-plate">{row.license}</span>
                            )}
                        </td>
                        {canEdit && (
                            <td className="action-cell">
                                {isEditing ? (
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => onSave(row.place)}
                                            disabled={isSaving}
                                            className="save-btn"
                                            title="Сохранить"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onCancel(row.place)}
                                            disabled={isSaving}
                                            className="cancel-btn"
                                            title="Отменить"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onEdit(row.place)}
                                        className="edit-btn"
                                        title="Редактировать"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );

    if (isLoading) {
        return (
            <div className="parking-table-container">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-slate-300">Загрузка данных о парковке...</span>
                </div>
            </div>
        );
    }

    const commandersData = parkingData.filter(s => s.category === 'commanders');
    const deputiesData = parkingData.filter(s => s.category === 'deputies');
    const juniorData = parkingData.filter(s => s.category === 'junior');

    return (
        <div className="parking-table-container">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="parking-table-header">
                <h1>🚗 Распределение парковочных мест</h1>
                {canEdit && (
                    <p className="edit-hint">
                        Нажмите на иконку редактирования для изменения данных. Используйте кнопки для сохранения или отмены. Esc - отменить.
                    </p>
                )}
            </div>

            <TableSection
                title="Маршал, Начальники и Командиры подразделений (места 1-8)"
                data={commandersData}
                headerClass="commanders"
                canEdit={!!canEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editingPlace={editingPlace}
                isSaving={isSaving}
                personRef={personRef}
                carRef={carRef}
                licenseRef={licenseRef}
            />

            <TableSection
                title="Заместители Командиров Подразделений (места 9-12)"
                data={deputiesData}
                headerClass="deputies"
                canEdit={!!canEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editingPlace={editingPlace}
                isSaving={isSaving}
                personRef={personRef}
                carRef={carRef}
                licenseRef={licenseRef}
            />

            <TableSection
                title="Младший состав (места 13-36)"
                data={juniorData}
                headerClass="junior"
                canEdit={!!canEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editingPlace={editingPlace}
                isSaving={isSaving}
                personRef={personRef}
                carRef={carRef}
                licenseRef={licenseRef}
            />
        </div>
    );
};

export default ParkingSpaces;