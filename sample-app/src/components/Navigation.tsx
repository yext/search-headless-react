import React, { useLayoutEffect, useCallback, useRef, useEffect, useState } from 'react';
import { ReactComponent as KebabIcon } from '../icons/kebab.svg';
import '../sass/Navigation.scss'

// Link labels must be unique
interface LinkData {
	label: string
	url?: string
	active?: boolean
}
interface Props {
	links: LinkData[]
	renderToggleContent?: () => {}
	cssClasses?: {
		root?: string
		list?: string
		item?: string
		link?: string
		activeItem?: string
		overflowWrapper?: string
		overflowToggle?: string
		overflowList?: string
		overflowItem?: string
		overflowLink?: string
	}
}

function renderDefaultToggleContent() {
	return <><KebabIcon /> More</>
}

const defaultClasses = {
	root: "Navigation",
	list: "Navigation__list",
	item: "Navigation__item",
	link: "Navigation__link",
	activeItem: "is-active",
	overflowWrapper: "Navigation__overflowWrapper",
	overflowToggle: "Navigation__overflowToggle",
	overflowList: "Navigation__overflowList",
	overflowItem: "Navigation__overflowItem",
	overflowLink: "Navigation__overflowLink",
}

export default function Navigation({ links, cssClasses, renderToggleContent = renderDefaultToggleContent }: Props) {
	const classes = Object.assign(defaultClasses, cssClasses);
	const [overflowLinks, setOverflowLinks] = useState<LinkData[]>([]);
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const containerRef = useRef<HTMLUListElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleOverflowMenuClick = () => {
		setMenuOpen(!menuOpen);
	}

	const handleDocumentClick = (evt: MouseEvent) => {
		const target = evt.target as HTMLElement;
		if (!menuRef.current || !menuRef.current.contains(target)) {
			setMenuOpen(false);
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleDocumentClick)
		return () => document.removeEventListener('click', handleDocumentClick);
	});

	const handleOverflow = useCallback(() => {
		const isOverflowing = containerRef.current?.offsetWidth !== containerRef.current?.scrollWidth
		const currentOverflowLength = overflowLinks.length;

		if (!isOverflowing || currentOverflowLength === links.length) return;

		const newOverflowLinks = links.slice(Math.max(0, links.length - currentOverflowLength - 1));
		setOverflowLinks(newOverflowLinks);
	}, [overflowLinks.length, links])

	useLayoutEffect(() => handleOverflow());

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		const resizeListener = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				setOverflowLinks([]);
				handleOverflow()
			}, 150)
		};
		window.addEventListener('resize', resizeListener);
		return () => window.removeEventListener('resize', resizeListener);
	}, [handleOverflow])

	if (links.length === 0) return null;

	return (
		<div className={classes.root}>
			<ul className={classes.list} ref={containerRef}>
				{links.map((link: LinkData, i: number) => {
					if (overflowLinks.map((l: LinkData) => l.label).includes(link.label)) {
						return null
					}

					const cls = link.active ? `${classes.item} ${classes.activeItem}` : classes.item;

					return (
						<li className={cls} key={i}>
							<a className={classes.link} href={link.url}>{link.label}</a>
						</li>
					)
				})}
			</ul>
			{overflowLinks.length !== 0 && (
				<div className={classes.overflowWrapper} ref={menuRef}>
					<button className={classes.overflowToggle} onClick={handleOverflowMenuClick}>
						{renderToggleContent()}
					</button>
					{menuOpen && (
						<div className={classes.overflowList}>
							{overflowLinks.map((link: LinkData, i: number) => (
								<li className={classes.overflowItem} key={i}>
									<a className={classes.overflowLink} href={link.url}>
										{link.label}
									</a>
								</li>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}