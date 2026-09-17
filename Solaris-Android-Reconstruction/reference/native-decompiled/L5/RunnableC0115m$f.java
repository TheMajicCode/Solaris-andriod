package L5;

import android.app.Activity;
import android.net.Uri;
import java.util.Map;

/* JADX INFO: renamed from: L5.m$f, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0115m$f implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1806f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ Uri f1807g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ p$a f1808h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    final /* synthetic */ Activity f1809i;

    RunnableC0115m$f(m mVar, Uri uri, p$a p_a, Activity activity) {
        this.f1806f = mVar;
        this.f1807g = uri;
        this.f1808h = p_a;
        this.f1809i = activity;
    }

    @Override // java.lang.Runnable
    public final void run() throws Throwable {
        try {
            Map mapE = p.f1844a.e(m.E(this.f1806f), this.f1807g, this.f1808h);
            s sVarL = m.L(this.f1806f);
            p$a p_a = this.f1808h;
            m mVar = this.f1806f;
            synchronized (sVarL) {
                p_a.c();
                m.L(mVar).i("solaris-attachment-unlock-check/1");
            }
            this.f1809i.runOnUiThread(new m$f$a(this.f1806f, this.f1808h, mapE));
        } catch (Exception e6) {
            this.f1809i.runOnUiThread(new m$f$b(this.f1806f, this.f1808h, e6));
        }
    }
}
