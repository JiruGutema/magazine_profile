import TurnstileForm from '@/components/common/TurnstileForm';

export const metadata = {
  title: 'Security check - Jiru Gutema',
};

export default function TurnstilePage() {
  const siteKey = process.env.CLOUDFLARE_SITE_KEY || process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '1x00000000000000000000AA';

  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">Security check</h1>
      </div>
      <div className="siteSub">From Jiru Gutema, the free encyclopedia</div>
      <div className="contentSub" />
      
      <p>
        Please complete the security challenge below to verify that you are human.
      </p>

      <TurnstileForm siteKey={siteKey} />
    </>
  );
}
