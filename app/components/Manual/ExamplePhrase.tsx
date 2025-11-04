import React, { useState } from 'react';
import "@/app/styles/examplePhrase.css"

interface ExamplePhraseProps {
    text: string;
    type?: "ms" | "ss";
    messageType?: "multiline" | "single";
    maxLength?: number;
}

const ExamplePhrase: React.FC<ExamplePhraseProps> = ({
                                                         text,
                                                         type = "ms",
                                                         messageType = "multiline",
                                                         maxLength = 160
                                                     }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        // Убираем табуляцию и лишние пробелы в начале строк
        const cleanText = text
            .split('\n')
            .map(line => line.trimStart())
            .join('\n')
            .trim();

        navigator.clipboard.writeText(cleanText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTextForDisplay = (text: string) => {
        if (messageType === "single") {
            const cleanText = text.trim();
            if (cleanText.length > maxLength) {
                return cleanText.substring(0, maxLength) + '...';
            }
            return cleanText;
        }

        // Для многострочных сообщений сохраняем структуру
        return text
            .split('\n')
            .map(line => line.trimStart())
            .join('\n')
            .trim();
    };

    return (
        <div
            className={`example-phrase ${type}-phrase ${messageType === "single" ? "single-line" : "multi-line"}`}
            onClick={copyToClipboard}
        >
            <div className="phrase-content">
                {messageType === "single" ? (
                    <span>{formatTextForDisplay(text)}</span>
                ) : (
                    <pre className="phrase-text">{formatTextForDisplay(text)}</pre>
                )}
            </div>
            <button className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? '✅ Скопировано!' : '📋 Копировать'}
            </button>
        </div>
    );
};

export default ExamplePhrase;
