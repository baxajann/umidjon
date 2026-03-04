import React, { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children, size = '' }) {
    useEffect(() => {
        if (isOpen) document.body.classList.add('no-scroll');
        else document.body.classList.remove('no-scroll');
        return () => document.body.classList.remove('no-scroll');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`modal ${size ? `modal-${size}` : ''}`}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
