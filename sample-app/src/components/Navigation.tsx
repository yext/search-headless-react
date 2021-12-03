import classNames from 'classnames';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as KebabIcon } from '../icons/kebab.svg';
import { useComposedCssClasses, CompositionMethod } from '../hooks/useComposedCssClasses';

interface NavigationCssClasses {
  nav?: string,
  linksWrapper?: string,
  menuWrapper?: string,
  navLink?: string,
  activeNavLink?: string,
  menuButton?: string,
  menuButtonContainer?: string,
  menuButton___menuOpen?: string,
  menuContainer?: string
}

const builtInCssClasses: NavigationCssClasses = {
  nav: 'border-b border-gray-200 text-gray-600 flex space-x-6 font-medium pt-4',
  navLink: 'whitespace-nowrap py-4 px-1 font-medium text-md border-b-2 border-opacity-0 hover:border-gray-300',
  activeNavLink: 'text-blue-600 border-blue-600 border-b-2 border-opacity-100 hover:border-blue-600',
  menuButtonContainer: 'relative flex flex-grow justify-end mr-4',
  menuButton: 'flex flex-row items-center font-medium text-md px-1 border-b-2 border-opacity-0 hover:border-gray-300',
  menuButton___menuOpen: 'bg-gray-200',
  menuContainer: 'absolute flex flex-col bg-white border top-14 mt-0.5'
}

interface LinkData {
  to: string,
  label: string
}

interface NavigationProps {
  links: LinkData[],
  customCssClasses?: NavigationCssClasses,
  cssCompositionMethod?: CompositionMethod
}

export default function Navigation({ links, customCssClasses, cssCompositionMethod }: NavigationProps) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
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
  const menuButtonClassNames = cssClasses.menuButton___menuOpen
    ? classNames(cssClasses.menuButton, {
      [cssClasses.menuButton___menuOpen]: menuOpen
    })
    : cssClasses.menuButton;
  return (
    <nav className={cssClasses.nav} ref={navigationRef}>
      {visibleLinks.map(l => renderLink(l, search, cssClasses))}
      {numOverflowLinks > 0 &&
        <div className={cssClasses.menuButtonContainer}>
          <button
            className={menuButtonClassNames}
            ref={menuRef}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <KebabIcon /> More
          </button>
          {menuOpen && 
            <div className={cssClasses.menuContainer}>
              {menuOpen && overflowLinks.map(l => renderLink(l, search, cssClasses))}
            </div>
          }
        </div>
      }
    </nav>
  )
}

function renderLink(
  linkData: LinkData,
  queryParams: string,
  cssClasses: { navLink?: string, activeNavLink?: string }) 
{
  const { to, label } = linkData;
  return (
    <NavLink
      key={to}
      className={cssClasses.navLink}
      activeClassName={cssClasses.activeNavLink}
      to={`${to}${queryParams}`}
      exact={true}
    >
      {label}
    </NavLink>
  )
}