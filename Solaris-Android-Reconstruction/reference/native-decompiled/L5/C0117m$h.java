package L5;

import android.net.Uri;
import kotlin.jvm.functions.Function1;
import p137u3.A;

/* JADX INFO: renamed from: L5.m$h, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0117m$h implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1818f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ Uri f1819g;

    C0117m$h(m mVar, Uri uri) {
        this.f1818f = mVar;
        this.f1819g = uri;
    }

    public final void b(char[] cArr) {
        if (cArr == null) {
            m.x(this.f1818f, "CANCELLED");
        } else {
            m mVar = this.f1818f;
            m.t(mVar, new m$h$a(mVar, this.f1819g, cArr));
        }
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        b((char[]) obj);
        return A.f16167a;
    }
}
