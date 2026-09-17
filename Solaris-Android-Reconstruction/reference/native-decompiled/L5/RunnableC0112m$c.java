package L5;

import android.app.Activity;
import android.content.Intent;

/* JADX INFO: renamed from: L5.m$c, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0112m$c implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1791f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ p$a f1792g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ Activity f1793h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    final /* synthetic */ int f1794i;

    RunnableC0112m$c(m mVar, p$a p_a, Activity activity, int i6) {
        this.f1791f = mVar;
        this.f1792g = p_a;
        this.f1793h = activity;
        this.f1794i = i6;
    }

    @Override // java.lang.Runnable
    public final void run() {
        try {
            if (m.z(this.f1791f) != this.f1792g) {
                return;
            }
            Activity activity = this.f1793h;
            Intent intent = new Intent("android.intent.action.OPEN_DOCUMENT");
            intent.addCategory("android.intent.category.OPENABLE");
            intent.setType("*/*");
            intent.putExtra("android.intent.extra.MIME_TYPES", p.f1844a.c());
            intent.putExtra("android.intent.extra.LOCAL_ONLY", true);
            intent.addFlags(1);
            activity.startActivityForResult(intent, this.f1794i);
        } catch (Exception unused) {
            if (m.z(this.f1791f) == this.f1792g) {
                m.x(this.f1791f, "ATTACHMENT_UNAVAILABLE");
            }
        }
    }
}
