import React, { useMemo } from 'react';
import Link from 'next/link';
import style from './breadcrumb.module.scss';
import { hrefGenerator, isExcludedPathPresent } from './utils';
import { ChevronLeftBlackIcon } from 'assets/icons';
import cn from 'classnames';

interface LanguageLabels {
  [language: string]: string | unknown;
}

interface BreadcrumbData {
  [key: string]: LanguageLabels & { disabled?: boolean };
}

interface BreadcrumbProps {
  pathAfter?: number;
  separator?: string;
  dir?: 'ltr' | 'rtl';
  language: string;
  data: BreadcrumbData;
  color?: string;
  path: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  pathAfter = 0,
  dir = 'ltr',
  language,
  data,
  color,
  path,
}) => {
  const pathname = path;
  const findPath = (val: string) => {
    if (data[val]) {
      return data[val][language];
    }

    const dynamicPath = val.replace(/\/[^/]+$/, '/?');
    if (data[dynamicPath]) {
      return data[dynamicPath][language];
    }
    return val.split('/').pop()?.replace('-', ' ').toUpperCase() || '';
  };

  const pathNames = useMemo(() => {
    let currentPath = decodeURI(`${pathname}` || '');

    if (currentPath.includes('?')) {
      currentPath = currentPath.split('?')[0];
    }
    let paths = currentPath.split('/').slice();
    let breadcrumbPaths: string[] = [];
    paths.reduce((acc, path) => {
      const newPath = `${acc ? acc + '/' + path : path}`.replace(/\/{2,}/g, '');
      breadcrumbPaths.push(newPath);
      return newPath;
    }, '');
    if (pathAfter > 0) {
      paths = paths.slice(pathAfter);
      breadcrumbPaths = breadcrumbPaths.slice(pathAfter);
    }

    return { paths, breadcrumbPaths };
  }, [pathname, pathAfter]);

  return (
    <div className="container-xxl">
      <div className="container">
        <div
          className={`${style['breadcrumb-route']} ${pathNames.paths.length ? '' : style['hide']} `}
        >
          <ul
            className={`${style['breadcrumb-items-block']} ${
              dir === 'rtl' ? style['rtl-direction'] : style['ltr-direction']
            }`}
          >
            {pathNames.paths
              .map((path, index) => {
                const fullPath = pathNames.breadcrumbPaths[index];
                const label = findPath(fullPath);
                if (label === '-') return null; // Skip elements with label "-"
                const disabled = index === pathNames?.paths?.length - 1;
                return !isExcludedPathPresent(fullPath) ? (
                  <>
                    {path ? (
                      <li key={fullPath} className={`${style['breadcrumb-item']} ${color}`}>
                        {index !== 0 ? <ChevronLeftBlackIcon /> : <></>}
                        {disabled ? (
                          <span className={style.disabled}>{(label as string) || ''}</span>
                        ) : (
                          <Link
                            id={index.toString()}
                            //chage color to black
                            className={cn(style['item-color'])}
                            href={`${hrefGenerator(fullPath)}`}
                          >
                            {(label as string) || path}
                          </Link>
                        )}
                      </li>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <> </>
                );
              })
              .filter(Boolean)}
            {/* Remove null elements */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
