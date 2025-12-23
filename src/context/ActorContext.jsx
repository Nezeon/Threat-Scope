import React, { createContext, useContext, useState, useEffect } from 'react';

const ActorContext = createContext();

export const useActor = () => {
    const context = useContext(ActorContext);
    if (!context) {
        throw new Error('useActor must be used within an ActorProvider');
    }
    return context;
};

export const ActorProvider = ({ children }) => {
    // Initial default list
    const DEFAULT_ACTORS = [
        "APT28", "Lazarus Group", "Fancy Bear", "Equation Group",
        "Sandworm", "LockBit", "Scattered Spider", "Volt Typhoon"
    ];

    const [actors, setActors] = useState(() => {
        const saved = localStorage.getItem('threat_actors');
        return saved ? JSON.parse(saved) : DEFAULT_ACTORS;
    });

    const [selectedActor, setSelectedActor] = useState(() => {
        const saved = localStorage.getItem('selected_actor');
        return saved ? saved : "APT28";
    });

    useEffect(() => {
        localStorage.setItem('threat_actors', JSON.stringify(actors));
    }, [actors]);

    useEffect(() => {
        localStorage.setItem('selected_actor', selectedActor);
    }, [selectedActor]);

    const addActor = (name) => {
        if (!name) return;
        if (!actors.includes(name)) {
            setActors(prev => [name, ...prev]);
        }
        setSelectedActor(name);
    };

    return (
        <ActorContext.Provider value={{ actors, selectedActor, setSelectedActor, addActor }}>
            {children}
        </ActorContext.Provider>
    );
};
