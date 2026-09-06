package world.dimx.sampleapp;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import world.dimx.core.AppConfig;
import world.dimx.core.ArCoreApkManager;
import world.dimx.core.Context;

/**
 * The smallest app that uses the DimensionX Android SDK: two buttons, one
 * opening an AR experience, one opening its web page. Everything the SDK
 * needs beyond this file - permissions, its activities, the ARCore
 * requirement - comes from the SDK's own manifest.
 */
public class MainActivity extends AppCompatActivity {

    // docs:begin urls
    // A public DimensionX experience: the dimension and one of its locations.
    private static final String AR_URL = "https://go.dimx.world/?dim=3358080808&loc=2134961551&live=1&place=1";
    private static final String WEB_URL = "https://go.dimx.world/?dim=3358080808";
    // docs:end

    private static final String[] PERMISSIONS = {
        Manifest.permission.CAMERA,
        Manifest.permission.ACCESS_FINE_LOCATION,
    };

    private boolean initialized;
    private Runnable afterPermissions;

    private final ActivityResultLauncher<String[]> permissionRequest = registerForActivityResult(
        new ActivityResultContracts.RequestMultiplePermissions(), granted -> {
            if (hasPermissions() && afterPermissions != null) {
                afterPermissions.run();
            } else {
                Toast.makeText(this, "Camera and location permissions are needed", Toast.LENGTH_LONG).show();
            }
            afterPermissions = null;
        });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.show_ar).setOnClickListener(view -> withPermissions(this::showArScreen));
        findViewById(R.id.show_web).setOnClickListener(view -> withPermissions(this::showWebScreen));
    }

    // docs:begin init
    /** Initialise the SDK once, after the permissions it needs are granted. */
    private void ensureInitialized() {
        if (initialized) {
            return;
        }
        AppConfig config = new AppConfig();
        config.setQRCodeEnabled(true);
        config.setSharePhotoEnabled(true);
        config.setShareVideoEnabled(false);
        config.addWebVersion("https://app.dimx.world/version");
        config.setDefaultAppUrl("https://go.dimx.world");
        // The activity the SDK returns to when its own screens close.
        config.setAppScreenActivity(MainActivity.class.getName());

        ArCoreApkManager.checkInstall(this);
        Context.initializeWithConfig(getApplicationContext(), config);
        initialized = true;
    }
    // docs:end

    // docs:begin screens
    private void showArScreen() {
        ensureInitialized();
        Context.inst().showARScreen(this, AR_URL, null, null);
    }

    private void showWebScreen() {
        ensureInitialized();
        Context.inst().showWebScreen(this, WEB_URL);
    }
    // docs:end

    private void withPermissions(Runnable action) {
        if (hasPermissions()) {
            action.run();
            return;
        }
        afterPermissions = action;
        permissionRequest.launch(PERMISSIONS);
    }

    private boolean hasPermissions() {
        for (String permission : PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }
}
