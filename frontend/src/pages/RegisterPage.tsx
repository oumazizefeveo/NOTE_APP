import { useState } from 'react';
import type { FormEvent } from "react";

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await register(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Impossible de créer le compte.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background p-4">
      <div className="card w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inscription</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Crée ton compte pour gérer tes notes.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mot de passe
              </label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                className="input"
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-blue-500 transition-colors">
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
