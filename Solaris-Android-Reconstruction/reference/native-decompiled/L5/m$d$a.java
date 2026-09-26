package L5;

import android.app.Activity;
import java.security.MessageDigest;
import p143v3.AbstractC0975j;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class m$d$a implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1798f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ byte[] f1799g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ char[] f1800h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    final /* synthetic */ Activity f1801i;

    m$d$a(m mVar, byte[] bArr, char[] cArr, Activity activity) {
        this.f1798f = mVar;
        this.f1799g = bArr;
        this.f1800h = cArr;
        this.f1801i = activity;
    }

    @Override // java.lang.Runnable
    public final void run() {
        try {
            m.T(this.f1798f, b.f1735a.c(this.f1799g, this.f1800h));
            m.V(this.f1798f, this.f1800h);
            m.U(this.f1798f, MessageDigest.getInstance("SHA-256").digest(this.f1799g));
            AbstractC0975j.o(this.f1799g, (byte) 0, 0, 0, 6, null);
            Activity activity = this.f1801i;
            activity.runOnUiThread(new m$d$a$a(activity, this.f1798f));
        } catch (Exception unused) {
            AbstractC0975j.o(this.f1799g, (byte) 0, 0, 0, 6, null);
            AbstractC0975j.p(this.f1800h, (char) 0, 0, 0, 6, null);
            m.j0(this.f1798f, null, 1, null);
        }
    }
}
