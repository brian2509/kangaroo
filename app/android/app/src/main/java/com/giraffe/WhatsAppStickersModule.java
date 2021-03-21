package com.giraffe;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.giraffe.stickers.Sticker;
import com.giraffe.stickers.StickerPack;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static com.giraffe.stickers.StickerContentProvider.STICKER_KEY_VALUE;


public class WhatsAppStickersModule extends ReactContextBaseJavaModule {

    /**
     * Do not change below values of below 3 lines as this is also used by WhatsApp
     */
    public static final String EXTRA_STICKER_PACK_ID = "sticker_pack_id";
    public static final String EXTRA_STICKER_PACK_AUTHORITY = "sticker_pack_authority";
    public static final String EXTRA_STICKER_PACK_NAME = "sticker_pack_name";

    static final String CONSUMER_WHATSAPP_PACKAGE_NAME = "com.whatsapp";
    static final String SMB_WHATSAPP_PACKAGE_NAME = "com.whatsapp.w4b";

    private static final int ADD_PACK = 200;

    WhatsAppStickersModule(ReactApplicationContext context) {
        super(context);
    }


    @NonNull
    @Override
    public String getName() {
        return "WhatsAppStickersModule";
    }

    @ReactMethod
    public void addToWhatsApp(String identifier, String stickerPackName) {
        Log.d(this.getName(), "addToWhatsApp function called.");
        Intent intent = createIntentToAddStickerPack(identifier, stickerPackName);
        intent.setPackage(CONSUMER_WHATSAPP_PACKAGE_NAME);
        try {
            getReactApplicationContext().getCurrentActivity().startActivityForResult(intent, ADD_PACK);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(getReactApplicationContext().getCurrentActivity(), "Something went wrong", Toast.LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void registerStickerPack(String identifier, String name, String publisher, String trayImageFile, String publisherEmail, String publisherWebsite, String privacyPolicyWebsite, String licenseAgreementWebsite, String imageDataVersion, boolean avoidCache, boolean animatedStickerPack, ReadableMap stickersMap) {
        StickerPack stickerPack = new StickerPack(identifier, name, publisher, trayImageFile, publisherEmail, publisherWebsite, privacyPolicyWebsite, licenseAgreementWebsite, imageDataVersion, avoidCache, animatedStickerPack);

        ReadableMapKeySetIterator itr = stickersMap.keySetIterator();
        ArrayList<Sticker> stickers = new ArrayList<>();
        while (itr.hasNextKey()) {
            String stickerName = itr.nextKey();
            String emojis = stickersMap.getString(stickerName);
            Sticker sticker = new Sticker(stickerName, Arrays.asList(emojis.split(",")));
            stickers.add(sticker);
        }
        stickerPack.setStickers(stickers);
        stickerPack.setAndroidPlayStoreLink("");

        // Put in set in case we eventually want the functionality to register multiple sticker packs.
        Set<String> serializedStickerPacks = new HashSet();
        String serializedStickerPack = new Gson().toJson(stickerPack);
        serializedStickerPacks.add(serializedStickerPack);

        // Get SharedPreferences
        Context context = getReactApplicationContext();
        SharedPreferences sharedPref = context.getSharedPreferences(context.getResources().getString(R.string.sticker_preferences), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();

        // Write Set of serialized StickerPack(s).
        editor.putStringSet(STICKER_KEY_VALUE, serializedStickerPacks);
        editor.apply();
    }

    @ReactMethod
    public void addStickerPackToWhatsApp(String identifier, String name, String publisher, String trayImageFile, String publisherEmail, String publisherWebsite, String privacyPolicyWebsite, String licenseAgreementWebsite, String imageDataVersion, boolean avoidCache, boolean animatedStickerPack, ReadableMap stickersMap) {
        Log.d(this.getName(), "addStickerPackToWhatsApp called");
        Log.d(this.getName(), stickersMap.toString());
        this.registerStickerPack(identifier, name, publisher, trayImageFile, publisherEmail, publisherWebsite, privacyPolicyWebsite, licenseAgreementWebsite, imageDataVersion, avoidCache, animatedStickerPack, stickersMap);
        this.addToWhatsApp(identifier, name);
    }

    @NonNull
    private Intent createIntentToAddStickerPack(String identifier, String stickerPackName) {
        Intent intent = new Intent();
        intent.setAction("com.whatsapp.intent.action.ENABLE_STICKER_PACK");
        intent.putExtra(EXTRA_STICKER_PACK_ID, identifier);
        intent.putExtra(EXTRA_STICKER_PACK_AUTHORITY, BuildConfig.CONTENT_PROVIDER_AUTHORITY);
        intent.putExtra(EXTRA_STICKER_PACK_NAME, stickerPackName);
        return intent;
    }
}
