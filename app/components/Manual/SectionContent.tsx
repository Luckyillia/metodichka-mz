import { Section } from '@/types/manualTypes';

interface SectionContentProps {
  section: Section;
}

export default function SectionContent({ section }: SectionContentProps) {
  return (
    <section id={section.id} className="section">
      <h1 className="section-title">{section.title}</h1>
      {section.content}
    </section>
  );
}
