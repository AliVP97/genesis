import type { ReactElement } from 'react';

import { MobileLayout } from 'layout/mobileLayout';
import AddComment from 'module/hotel/addComment';
import { Layout } from 'layout/desktopLayout';

export default function AddCommentPage() {
  return <AddComment />;
}

// useEffect(()=>{
//   localStorage.removeItem('uuid-expiry');
// },[])

AddCommentPage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout isServiceImageShown={false} isProtected>
      <div>{page}</div>
    </Layout>
  ) : (
    <MobileLayout title="ثبت نظر" isProtected hideBackButton={true}>
      {page}
    </MobileLayout>
  );
};
