package com.giraffe;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class WhatsAppStickersModule extends ReactContextBaseJavaModule {
    WhatsAppStickersModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "WhatsAppStickersModule";
    }

    @ReactMethod
    public void addToWhatsApp() {
        Log.d(this.getName(), "addToWhatsApp function called.");
    }
}
