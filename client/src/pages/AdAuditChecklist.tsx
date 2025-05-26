import LeadMagnetTemplate from './LeadMagnetTemplate';

export default function AdAuditChecklist() {
  return (
    <LeadMagnetTemplate
      title="Free Ad Account Audit Checklist"
      description="Get our comprehensive 27-point checklist that our experts use to audit Facebook & Google ad accounts. Stop wasting money on underperforming ads!"
      offer="Download now and start optimizing your ad campaigns today!"
      bulletPoints={[
        "Identify costly mistakes in your ad setup",
        "Optimize your campaign structure",
        "Improve your targeting strategy",
        "Enhance your conversion tracking",
        "Reduce wasted ad spend"
      ]}
      buttonText="Get Your Free Checklist"
    />
  );
}
