import classNames from 'classnames';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as KebabIcon } from '../icons/kebab.svg';
import '../sass/Navigation.scss';

interface LinkData {
  to: string,
  label: string
}

interface NavigationProps {
  links: LinkData[]
}

export default function Navigation({ links }: NavigationProps) {
  // Close the menu when clicking the document
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const handleDocumentClick = (e: MouseEvent) => {
    if (e.target !== menuRef.current) {
      setMenuOpen(false);
    }
  };
  useLayoutEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Responsive tabs
  const [numOverflowLinks, setNumOverflowLinks] = useState<number>(0);
  const navigationRef = useRef<HTMLDivElement>(null);
  const handleResize = useCallback(() => {
    const navEl = navigationRef.current;
    if (!navEl) {
      return;
    }
    const isOverflowing = navEl.scrollWidth > navEl.offsetWidth;
    if (isOverflowing && numOverflowLinks < links.length) {
      setNumOverflowLinks(numOverflowLinks + 1);
    }
  }, [links.length, numOverflowLinks])
  useLayoutEffect(handleResize, [handleResize]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    function resizeListener() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setNumOverflowLinks(0);
        handleResize()
      }, 50)
    };
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, [handleResize]);

  const { search } = useLocation();
  const visibleLinks = links.slice(0, links.length - numOverflowLinks);
  const overflowLinks = links.slice(-numOverflowLinks);
  const menuButtonClassNames = classNames('Navigation__menuButton', {
    'Navigation__menuButton--open': menuOpen
  });
  return (
    <nav className='Navigation' ref={navigationRef}>
      <div className='Navigation__links'>
        {visibleLinks.map(l => renderLink(l, search))}
      </div>
      {numOverflowLinks > 0 &&
        <div className='Navigation__menuWrapper'>
          <button
            className={menuButtonClassNames}
            ref={menuRef}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <KebabIcon /> More
          </button>
          <div className='Navigation__menuLinks'>
            {menuOpen && overflowLinks.map(l => renderLink(l, search))}
          </div>
        </div>
      }
    </nav>
  )
}

function renderLink(linkData: LinkData, queryParams: string) {
  const { to, label } = linkData;
  return (
    <NavLink
      key={to}
      className='Navigation__link'
      activeClassName='Navigation__link--currentRoute'
      to={`${to}${queryParams}`}
      exact={true}
    >
      {label}
    </NavLink>
  )
}