import React, { createContext, useState, useEffect } from 'react';

export const UserIdContext = createContext();
export const GroupIdContext = createContext();

export const GroupIdProvider = ({ children }) => {
    const [groupId, setGroupId] = useState(() => {
        return localStorage.getItem('groupId') || '';
    });

    useEffect(() => {
        localStorage.setItem('groupId', groupId);
    }, [groupId]);

    return (
        <GroupIdContext.Provider value={{ groupId, setGroupId }}>
            {children}
        </GroupIdContext.Provider>
    );
};

export const UserIdProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId') || '';
    });

    useEffect(() => {
        localStorage.setItem('userId', userId);
    }, [userId]);

    return (
        <UserIdContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserIdContext.Provider>
    );
};
