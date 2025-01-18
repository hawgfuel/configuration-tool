export type CrumbType = 'function' | 'href' | 'click';

export type BreadcrumbType = {
  /** The text of the breadcrumb to show to the user */
  text?: string,
  /** The action of the breadcrumb, string for href and click types, functions for functional */
  value: string,
  /** The type of breadcrumb action - href, click (elementID), or function. */
  type?: CrumbType,
};

export type BreadcrumbsType = {
  [index: number]: BreadcrumbType;
};

export const updateBreadcrumb = (crumbs: BreadcrumbsType, attemptNumber: number = 0) => {
  // @ts-ignore
  const { updateBreadcrumbs } = window;
  let failed = false;

  if (typeof updateBreadcrumbs === 'function') {
    try {
      updateBreadcrumbs(crumbs);
    } catch (e) {
      console.log(e);
      failed = true;
    }
  } else {
    console.log(`failed to resolve function: typeof: '${typeof updateBreadcrumbs}'`);
    failed = true;
  }

  // try up to 5 times to set the breadcrumbs, but don't try to set them infinitely.
  if (failed && attemptNumber < 5) {
    setTimeout(() => updateBreadcrumb(crumbs, attemptNumber + 1), 1000);
  }
};
