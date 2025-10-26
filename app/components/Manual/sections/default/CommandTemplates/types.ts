// Типы для системы команд

export interface GlobalSettings {
    doctorTag: string;
    city: string;
}

export interface CallsSettings {
    callNumber: string;
    partnerName: string;
}

export interface PatrolSettings {
    partnerName: string;
}

export interface PostsSettings {
    selectedPost: string;
    partnerName: string;
}

export interface DepartmentsSettings {
    fromDepartment: string;
    toDepartment: string;
    reason: string;
    // Для запроса наряда МВД
    mvdDepartment: string;
    mvdLocation: string;
    mvdReason: string;
    // Для разрешения на посадку
    landingDepartment: string;
    landingReason: string;
    // Для начала движения колонной
    columnDepartment: string;
}

export interface ShiftSettings {
    // Нет локальных настроек, используются только глобальные
}

export interface BindsSettings {
    gender: 'male' | 'female';
    firstName: string;
    lastName: string;
    position: string;
}

export interface TabSettings {
    calls: CallsSettings;
    patrol: PatrolSettings;
    posts: PostsSettings;
    departments: DepartmentsSettings;
    shift: ShiftSettings;
    binds: BindsSettings;
}

export type TabType = 'calls' | 'patrol' | 'posts' | 'departments' | 'shift' | 'binds';

export interface CommandGroup {
    [commandName: string]: string[];
}

export interface CityPosts {
    [city: string]: string[];
}
