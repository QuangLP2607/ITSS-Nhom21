import React, { createContext, useState } from 'react';

export const UserIdContext = createContext();
export const GroupIdContext = createContext();

export const GroupIdProvider = ({ children }) => {
    const [groupId, setGroupId] = useState('');

    return (
        <GroupIdContext.Provider value={{ groupId, setGroupId }}>
            {children}
        </GroupIdContext.Provider>
    );
};

export const UserIdProvider = ({ children }) => {
    const [userId, setUserId] = useState('');

    return (
        <UserIdContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserIdContext.Provider>
    );
};
