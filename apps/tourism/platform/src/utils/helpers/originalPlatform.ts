// This function and the 'original_platform' parameter are used to identify webviewing users within iOS and Android apps.
// We retrieve the 'original_platform' value and set it as the 'Grpc-metadata-Original-Platform' header...
// only in 'create' requests of businesses which are web viewed on applications such as tour or visa.
// By setting the 'Grpc-metadata-Original-Platform' header, we can distinguish whether a user has made an order
// from within an app (web view) or directly from the web.

export const originalPlatform = () => localStorage.getItem('original_platform') || 'web';
