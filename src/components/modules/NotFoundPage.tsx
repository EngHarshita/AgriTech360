import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const homeUrl = user?.role === 'buyer' ? '/client/dashboard' : '/farmer/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/[0.08] p-8 text-center animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-5 text-slate-500 shadow-soft">
          <FileQuestion className="w-9 h-9" aria-hidden="true" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          404 - Page Not Found
        </h1>

        <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
          The requested URL does not exist or has been moved within the AgriTech360 platform.
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => navigate(homeUrl)}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return to Dashboard
          </Button>

          <div>
            <Link
              to="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
