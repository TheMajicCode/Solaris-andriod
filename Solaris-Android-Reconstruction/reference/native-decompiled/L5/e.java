package L5;

import android.hardware.biometrics.BiometricPrompt$Builder;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class e {
    public static /* bridge */ /* synthetic */ BiometricPrompt$Builder a(BiometricPrompt$Builder biometricPrompt$Builder, int i6) {
        return biometricPrompt$Builder.setAllowedAuthenticators(i6);
    }
}
