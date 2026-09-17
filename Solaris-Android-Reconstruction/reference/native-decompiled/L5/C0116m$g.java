package L5;

import android.content.Context;
import android.net.Uri;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.Map;
import p143v3.AbstractC0975j;
import p143v3.L;

/* JADX INFO: renamed from: L5.m$g, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0116m$g implements I3.a {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1816f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ Uri f1817g;

    C0116m$g(m mVar, Uri uri) {
        this.f1816f = mVar;
        this.f1817g = uri;
    }

    @Override // I3.a
    public final Object invoke() throws IOException {
        c cVar = c.f1737a;
        Context contextE = m.E(this.f1816f);
        Uri uri = this.f1817g;
        byte[] bArrI = m.I(this.f1816f);
        if (bArrI == null) {
            throw new IllegalStateException("RECOVERY_INVALID");
        }
        byte[] bArrB = cVar.b(contextE, uri, bArrI);
        b bVar = b.f1735a;
        char[] cArrK = m.K(this.f1816f);
        if (cArrK == null) {
            throw new IllegalStateException("RECOVERY_INVALID");
        }
        byte[] bArrA = bVar.a(bArrB, cArrK);
        try {
            if (!MessageDigest.isEqual(MessageDigest.getInstance("SHA-256").digest(bArrA), m.J(this.f1816f))) {
                throw new IllegalArgumentException("RECOVERY_INVALID");
            }
            Map mapL = L.l(p137u3.s.a("verified", Boolean.TRUE), p137u3.s.a("bytes", Integer.valueOf(bArrB.length)));
            AbstractC0975j.o(bArrA, (byte) 0, 0, 0, 6, null);
            return mapL;
        } catch (Throwable th) {
            AbstractC0975j.o(bArrA, (byte) 0, 0, 0, 6, null);
            throw th;
        }
    }
}
