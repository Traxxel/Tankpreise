import React from 'react';
import { Toolbar, Item } from 'devextreme-react/toolbar';
import { Button } from 'devextreme-react/button';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
    onNavigate: (route: string) => void;
    currentRoute: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, currentRoute }) => {
    return (
        <div className="main-layout">
            <Toolbar className="header-toolbar">
                <Item
                    location="before"
                    render={() => (
                        <div className="toolbar-label">Tankpreise</div>
                    )}
                />
                <Item
                    location="center"
                    render={() => (
                        <div className="toolbar-buttons">
                            <Button
                                text="Tankstellen"
                                type={currentRoute === 'stations' ? 'default' : 'normal'}
                                onClick={() => onNavigate('stations')}
                            />
                            <Button
                                text="Preisvergleich"
                                type={currentRoute === 'prices' ? 'default' : 'normal'}
                                onClick={() => onNavigate('prices')}
                            />
                            <Button
                                text="Preisverlauf"
                                type={currentRoute === 'history' ? 'default' : 'normal'}
                                onClick={() => onNavigate('history')}
                            />
                        </div>
                    )}
                />
            </Toolbar>
            <div className="content">
                {children}
            </div>
        </div>
    );
}; 