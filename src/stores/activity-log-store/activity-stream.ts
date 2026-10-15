import type { ActivityEventTemplate } from '../../data/activity-log.data';
import { STREAMING_ACTIVITY_TEMPLATES } from '../../data/activity-log.data';

const STREAM_INTERVAL_MS = 5000;

export function startActivityStream(
  isActive: () => boolean,
  onTemplate: (template: ActivityEventTemplate) => void,
): () => void {
  let templateIndex = 0;
  const timer = setInterval(() => {
    if (!isActive()) return;
    const template = STREAMING_ACTIVITY_TEMPLATES[templateIndex % STREAMING_ACTIVITY_TEMPLATES.length];
    templateIndex++;
    onTemplate(template);
  }, STREAM_INTERVAL_MS);
  return () => clearInterval(timer);
}
