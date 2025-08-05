import { Link as BaseLink, LinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

/**
 * A type-safe wrapper around react-router-dom's Link component.
 * This helps resolve TypeScript errors related to the Link component.
 */
export const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <BaseLink {...props} ref={ref} />;
  }
);

RouterLink.displayName = 'RouterLink';

export default RouterLink;
