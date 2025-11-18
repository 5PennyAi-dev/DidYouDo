import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components';

function SettingsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>

          <h1 className="text-3xl font-bold text-text mb-2">
            Paramètres
          </h1>
        </header>

        <main>
          <Card>
            <p className="text-gray-700">
              Configuration à venir...
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;
