import React from 'react';
import { Link } from 'react-router-dom';
import { preloadRoute } from '../utils/routePreloader';

/**
 * Enhanced Link component that preloads the target route on hover/focus
 * @param {Object} props - Component props
 * @param {string} props.to - Target route path
 * @param {Function} props.lazyComponent - Lazy-loaded component to preload
 * @param {string} props.routeName - Name of the route for tracking
 * @param {React.ReactNode} props.children - Link content
 * @param {string} props.className - CSS classes
 * @param {Object} props.rest - Additional props to pass to Link
 */
const PreloadLink = ({ 
  to, 
  lazyComponent, 
  routeName, 
  children, 
  className = '',
  ...rest 
}) => {
  const handlePreload = () => {
    if (lazyComponent && routeName) {
      preloadRoute(lazyComponent, routeName);
    }
  };

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={handlePreload}
      onFocus={handlePreload}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default PreloadLink;
