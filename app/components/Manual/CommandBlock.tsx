import React, { useState } from 'react';
import ExamplePhrase from './ExamplePhrase';
import '@/app/styles/commandBlock.css'

interface CommandBlockProps {
    command: string;
    description: string;
}

const CommandBlock: React.FC<CommandBlockProps> = ({ command, description }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="command-block">
            <div className="command-header">
                <div>
                    <h4 className="command-title">{command}</h4>
                    <p className="command-description">{description}</p>
                </div>
                <div className="command-actions">
                    <button
                        onClick={copyToClipboard}
                        className="copy-button"
                        title="Copy command"
                    >
                        {copied ? (
                            <>
                                <span>✓</span>
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <span>📋</span>
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommandBlock;
