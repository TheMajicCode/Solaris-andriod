package L5;

import android.hardware.biometrics.BiometricManager;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class d {
    public static /* bridge */ /* synthetic */ int a(BiometricManager biometricManager, int i6) {
        return biometricManager.canAuthenticate(i6);
    }
}
