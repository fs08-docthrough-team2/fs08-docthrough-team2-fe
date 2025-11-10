import ChallengeEditPageClient from '@/components/pages/ChallengeEditPageClient';

export default function AdminChallengeEditPage({ params }) {
  return <ChallengeEditPageClient challengeId={params.challengeId} />;
}
