package L5;

import android.app.Activity;
import android.content.Intent;

/* JADX INFO: renamed from: L5.m$e, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0114m$e implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ Activity f1804f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ m f1805g;

    RunnableC0114m$e(Activity activity, m mVar) {
        this.f1804f = activity;
        this.f1805g = mVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        try {
            Activity activity = this.f1804f;
            Intent intent = new Intent("android.intent.action.OPEN_DOCUMENT");
            intent.addCategory("android.intent.category.OPENABLE");
            intent.setType("*/*");
            activity.startActivityForResult(intent, 6143);
        } catch (Exception unused) {
            m.j0(this.f1805g, null, 1, null);
        }
    }
}
