#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SpeakerRoutePlugin, "SpeakerRoute",
  CAP_PLUGIN_METHOD(applyPreferredRoute, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(isExternalConnected, CAPPluginReturnPromise);
)