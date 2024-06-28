package com.montraexpensetracker

import androidx.credentials.GetCredentialRequest
import androidx.credentials.CredentialManager
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.exceptions.GetCredentialException
import com.facebook.react.bridge.*
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GoogleSignInHandler(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "GoogleSignInHandler"

    private val credentialManager = CredentialManager.create(reactContext)
    private val signInWithGoogleOption: GetSignInWithGoogleOption = GetSignInWithGoogleOption.Builder("426728684733-08hbgavcdljaclium152ea992drr4ev3.apps.googleusercontent.com")
        .build()
    private val request: GetCredentialRequest = GetCredentialRequest.Builder()
        .addCredentialOption(signInWithGoogleOption)
        .build()

    @ReactMethod
    fun signIn(promise: Promise) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val result = credentialManager.getCredential(
                    request = request,
                    context = reactApplicationContext
                )
                val credential=result.credential
                val googleIdTokenCredential=GoogleIdTokenCredential.createFrom(credential.data)
                val idToken=googleIdTokenCredential.idToken
                promise.resolve(idToken)
            } catch (e: GetCredentialException) {
                promise.reject("ERROR", e)
            }
        }
    }

    private val clearCredentialStateRequest:ClearCredentialStateRequest=ClearCredentialStateRequest()
    @ReactMethod
    fun signOut(promise: Promise) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                credentialManager.clearCredentialState(request = clearCredentialStateRequest)
                promise.resolve("Sign out successful")
            } catch (e: GetCredentialException) {
                promise.reject("ERROR", e)
            }
        }
    }
}
