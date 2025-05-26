import { Helmet } from 'react-helmet';
import { LeadForm } from '@/components/LeadForm';

export default function TestLeadForm() {
  return (
    <>
      <Helmet>
        <title>Test Lead Form - AdVelocity</title>
      </Helmet>
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Test Lead Form</h1>
          <LeadForm buttonText="Submit Test Lead" />
        </div>
      </main>
    </>
  );
}
