import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export function Avatar({ userId, size = 'md', user: propUser }) {
    const { currentUser } = useAuth();
    const user = propUser || (userId === currentUser?.id ? currentUser : null);
    const name = user?.name || '?';
    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    return (
        <span className={`avatar avatar-${size}`}>
            {user?.avatar ? <img src={user.avatar} alt={name} /> : initials}
        </span>
    );
}
