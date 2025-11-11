import ChallengeEditPageClient from '@/components/pages/ChallengeEditPageClient';

export default async function AdminChallengeEditPage({ params }) {
  const resolvedParams = await params;
  return <ChallengeEditPageClient challengeId={resolvedParams.challengeId} />;
}
