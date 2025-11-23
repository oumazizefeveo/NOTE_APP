import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Note } from '../types/note';
import { FiPieChart } from 'react-icons/fi';

export function SettingsPage() {
    const [stats, setStats] = useState<{ [key: string]: number }>({
        travail: 0,
        personnel: 0,
        urgent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get<Note[]>('/notes');
                const notes = res.data;

                const newStats = {
                    travail: notes.filter(n => n.category === 'travail').length,
                    personnel: notes.filter(n => n.category === 'personnel').length,
                    urgent: notes.filter(n => n.category === 'urgent').length,
                };
                setStats(newStats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Paramètres & Statistiques</h1>

            <div className="space-y-6">
                <div className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
                    <FiPieChart className="text-primary" />
                    <h2>Statistiques des notes</h2>
                </div>

                {loading ? (
                    <div className="animate-pulse flex gap-4">
                        <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card border-l-4 border-l-blue-500">
                            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Travail</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.travail}</p>
                        </div>
                        <div className="card border-l-4 border-l-green-500">
                            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Personnel</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.personnel}</p>
                        </div>
                        <div className="card border-l-4 border-l-red-500">
                            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Urgent</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.urgent}</p>
                        </div>
                        <div className="card bg-slate-900 text-white dark:bg-slate-700">
                            <h3 className="text-slate-400 font-medium">Total</h3>
                            <p className="text-3xl font-bold mt-2">{stats.travail + stats.personnel + stats.urgent}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Préférences</h2>
                <div className="card">
                    <p className="text-slate-600 dark:text-slate-400">D'autres paramètres seront disponibles bientôt.</p>
                </div>
            </div>
        </div>
    );
}
