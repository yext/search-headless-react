import { useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDOMSize } from '../hooks/useDOMSize';
import { ReactComponent as KebabIcon } from '../icons/kebab.svg';
import '../sass/Navigation.scss';

interface LinkData {
  to: string
  label: string
}

interface NavigationProps {
  links: LinkData[]
}

export default function Navigation(props: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { search } = useLocation();
  const navigationRef = useRef<HTMLDivElement>(null);
  const size = useDOMSize<HTMLDivElement>(navigationRef);
  console.log(size);

  useLayoutEffect(() => {

  }, [])

  const handleDocumentClick = () => {
    setMenuOpen(false);
  };

  useLayoutEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // const handleOverflow = () => {
  //   const isOverflowing = containerRef.current?.offsetWidth !== containerRef.current?.scrollWidth
  //   const currentOverflowLength = overflowLinks.length;

  //   if (!isOverflowing || currentOverflowLength === links.length) return;

  //   const newOverflowLinks = links.slice(Math.max(0, links.length - currentOverflowLength - 1));
  //   setOverflowLinks(newOverflowLinks);
  // }

  const { links } = props;
  return (
    <div className='Navigation' ref={navigationRef}>
      {links.map(l => renderLink(l, search))}
      <div className='Navigation__moreButton'>
        <KebabIcon/> More
      </div>
    </div>
  )
}

function renderLink(linkData: LinkData, search: string) {
  const { to, label } = linkData;
  return (
    <NavLink
      key={to}
      className='Navigation__link'
      activeClassName='Navigation__link--currentRoute'
      to={`${to}${search}`}
      exact={true}
    >
      {label}
    </NavLink>
  )
}