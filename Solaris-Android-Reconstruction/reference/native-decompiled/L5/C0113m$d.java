package L5;

import android.app.Activity;
import kotlin.jvm.functions.Function1;
import p137u3.A;
import p143v3.AbstractC0975j;

/* JADX INFO: renamed from: L5.m$d, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0113m$d implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ byte[] f1795f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ m f1796g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ Activity f1797h;

    C0113m$d(byte[] bArr, m mVar, Activity activity) {
        this.f1795f = bArr;
        this.f1796g = mVar;
        this.f1797h = activity;
    }

    public final void b(char[] cArr) {
        if (cArr != null) {
            m.H(this.f1796g).execute(new m$d$a(this.f1796g, this.f1795f, cArr, this.f1797h));
        } else {
            AbstractC0975j.o(this.f1795f, (byte) 0, 0, 0, 6, null);
            m.x(this.f1796g, "CANCELLED");
        }
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        b((char[]) obj);
        return A.f16167a;
    }
}
