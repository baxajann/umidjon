import React from 'react';
import { getStatusClass, getStatusLabel } from '../../utils/helpers.js';

export function Badge({ status, children, className = '' }) {
    const cls = status ? getStatusClass(status) : '';
    const label = status ? getStatusLabel(status) : children;
    return <span className={`badge ${cls} ${className}`}>{label}</span>;
}
