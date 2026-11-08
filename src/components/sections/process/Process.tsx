import { getTranslations } from 'next-intl/server';
import { ProcessTimeline, type ProcessStep } from './ProcessTimeline';

export async function Process() {
  const t = await getTranslations('process');
  return (
    <section id="process" aria-labelledby="process-title" className="relative">
      <ProcessTimeline
        label={t('label')}
        title={t.raw('title') as string[]}
        intro={t('intro')}
        deliverablesLabel={t('deliverablesLabel')}
        steps={t.raw('steps') as ProcessStep[]}
      />
    </section>
  );
}
