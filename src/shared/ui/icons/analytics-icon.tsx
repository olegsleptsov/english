import { ChartBar } from '@gravity-ui/icons';
import type { SVGProps } from 'react';

export type AnalyticsIconProps = SVGProps<SVGSVGElement>;

export function AnalyticsIcon(props: AnalyticsIconProps) {
  return <ChartBar aria-hidden="true" focusable="false" {...props} />;
}
