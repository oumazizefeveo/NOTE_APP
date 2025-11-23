import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { FiHome, FiSettings, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import classNames from 'classnames';

export function DashboardLayout() {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background dark:bg-dark-background text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-surface dark:bg-dark-surface border-r border-slate-200 dark:border-slate-700 flex flex-col transition-colors duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                        N
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Notes App
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            classNames(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            )
                        }
                    >
                        <FiHome className="w-5 h-5" />
                        <span>Mes Notes</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            classNames(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            )
                        }
                    >
                        <FiSettings className="w-5 h-5" />
                        <span>Paramètres</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Thème</span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                            aria-label="Changer de thème"
                        >
                            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 mt-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-sm font-medium">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Se déconnecter"
                        >
                            <FiLogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-50 dark:bg-dark-background p-8 transition-colors duration-200">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
