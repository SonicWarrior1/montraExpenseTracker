//
//  RCTGoogleSigninModule.m
//  montraExpenseTracker
//
//  Created by ChicMic on 01/07/24.
//

#import "RCTGoogleSigninModule.h"
#import <React/RCTLog.h>
#import <GoogleSignIn/GoogleSignIn.h>

@implementation RCTGoogleSigninModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(googleSignin:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  UIViewController *presentedViewController = RCTPresentedViewController();
  [GIDSignIn.sharedInstance signInWithPresentingViewController:presentedViewController completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
    if (error == nil && signInResult.user) {
      // Successful sign-in
      GIDGoogleUser *user = signInResult.user;
      GIDToken *idToken=user.idToken;
      resolve(idToken.tokenString);
    } else {
      // Handle error
      NSLog(@"Error signing in: %@", error.localizedDescription);
      reject(@"google_signin_error", @"Error signing in", error);
    }
  }];
}
RCT_EXPORT_METHOD(googleSignOut:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[GIDSignIn sharedInstance] signOut];
    resolve(@"Signed out");
}
@end
