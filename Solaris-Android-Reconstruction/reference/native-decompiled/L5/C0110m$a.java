package L5;

import android.hardware.biometrics.BiometricPrompt$AuthenticationCallback;
import android.hardware.biometrics.BiometricPrompt$AuthenticationResult;

/* JADX INFO: renamed from: L5.m$a, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0110m$a extends BiometricPrompt$AuthenticationCallback {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    final /* synthetic */ long f1787a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    final /* synthetic */ m f1788b;

    C0110m$a(long j6, m mVar) {
        this.f1787a = j6;
        this.f1788b = mVar;
    }

    @Override // android.hardware.biometrics.BiometricPrompt$AuthenticationCallback
    public void onAuthenticationError(int i6, CharSequence charSequence) {
        J3.l.f(charSequence, "message");
        if (this.f1787a != m.C(this.f1788b) || m.M(this.f1788b) == null) {
            return;
        }
        if (i6 == 5 || i6 == 10) {
            m.x(this.f1788b, "CANCELLED");
        } else {
            m.w(this.f1788b, this.f1787a);
        }
    }

    @Override // android.hardware.biometrics.BiometricPrompt$AuthenticationCallback
    public void onAuthenticationSucceeded(BiometricPrompt$AuthenticationResult biometricPrompt$AuthenticationResult) {
        J3.l.f(biometricPrompt$AuthenticationResult, "result");
        if (this.f1787a != m.C(this.f1788b) || m.M(this.f1788b) == null) {
            return;
        }
        m.O(this.f1788b, this.f1787a, false);
    }
}
