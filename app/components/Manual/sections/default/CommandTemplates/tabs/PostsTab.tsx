import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { PostsSettings, GlobalSettings } from '../types';
import { cityPosts } from '../constants';

interface PostsTabProps {
    settings: PostsSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof PostsSettings, value: string) => void;
}

// Генерация команд для постов
const generatePostCommands = (postName: string, doctorTag: string, partnerName?: string) => {
    const partner = partnerName ? ` | Напарник: ${partnerName}.` : '';

    return [
        `r [${doctorTag}] Выехал на пост ${postName}.${partner}`,
        `r [${doctorTag}] Заступил на пост ${postName}.${partner}`,
        `r [${doctorTag}] Продолжаю стоять на посту ${postName}. Вылечено граждан: 0.${partner}`,
        `r [${doctorTag}] Покидаю пост ${postName}.${partner}`,
        `r [${doctorTag}] Вернулся с поста ${postName}.${partner}`
    ];
};

const PostsTab: React.FC<PostsTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const availablePosts = cityPosts[globalSettings.city] || [];

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3>📍 Посты</h3>
                <div className="flex gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium mb-1">Пост:</label>
                        <select
                            value={settings.selectedPost}
                            onChange={(e) => onSettingChange('selectedPost', e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm min-w-[200px]"
                        >
                            <option value="">Выберите пост</option>
                            {availablePosts.map(post => (
                                <option key={post} value={post}>{post}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Напарник:</label>
                        <input
                            type="text"
                            value={settings.partnerName}
                            onChange={(e) => onSettingChange('partnerName', e.target.value)}
                            placeholder="Имя напарника"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                </div>
            </div>

            {settings.selectedPost ? (
                <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">
                        Команды для поста: {settings.selectedPost}
                    </h4>
                    {generatePostCommands(settings.selectedPost, globalSettings.doctorTag, settings.partnerName).map((command, index) => (
                        <ExamplePhrase
                            key={index}
                            text={command}
                            messageType={"single"}
                            type={"ms"}
                            maxLength={200}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    Выберите пост из списка выше, чтобы увидеть команды
                </div>
            )}
        </>
    );
};

export default PostsTab;
