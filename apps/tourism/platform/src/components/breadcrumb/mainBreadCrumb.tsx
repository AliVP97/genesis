import { schema } from 'utils/static/cms/schema';
import dynamic from 'next/dynamic';
import { breadCrumbModel, breadCrumbObjectModel } from './types';
import { useWeb } from 'utils/hooks/useWeb';
const Breadcrumb = dynamic(() => import('./index'), {
  ssr: true,
});
const MainBreadcrumb = ({
  breadCrumb,
  path,
}: {
  cityName?: string;
  hotelName?: string;
  path: string;
  breadCrumb: breadCrumbModel;
}): JSX.Element => {
  const isWeb = useWeb();
  return isWeb ? (
    <div className="p-1 mb-6 d-flex flex-row-reverse overflow-auto">
      {schema.breadCrumb(Object.assign({}, breadCrumb as breadCrumbObjectModel))}
      <Breadcrumb
        path={path}
        data={Object.assign({}, breadCrumb as breadCrumbObjectModel)}
        language="fa"
        dir="rtl"
        separator=">"
        color="color-primary"
      />
    </div>
  ) : (
    <></>
  );
};
export default MainBreadcrumb;
