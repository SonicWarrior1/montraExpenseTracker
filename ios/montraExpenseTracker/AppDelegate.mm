#import "AppDelegate.h"
#import "RNBootSplash.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"montraExpenseTracker";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [FIRApp configure];
  NSString *clientID = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"GIDClientID"];
  GIDConfiguration *config = [[GIDConfiguration alloc] initWithClientID:clientID];
  [GIDSignIn sharedInstance].configuration = config;
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
}
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    // First, handle Google Sign-In URL
    if ([[GIDSignIn sharedInstance] handleURL:url]) {
        return YES; // Google Sign-In successfully handled the URL
    }

    // Then, handle React Native Linking Manager URL
    if ([RCTLinkingManager application:application openURL:url options:options]) {
        return YES; // React Native Linking successfully handled the URL
    }

    // If neither Google Sign-In nor React Native handled the URL, return NO
    return NO;
}

@end
