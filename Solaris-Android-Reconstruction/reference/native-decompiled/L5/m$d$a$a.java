package L5;

import android.app.Activity;
import android.content.Intent;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class m$d$a$a implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ Activity f1802f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ m f1803g;

    m$d$a$a(Activity activity, m mVar) {
        this.f1802f = activity;
        this.f1803g = mVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        try {
            Activity activity = this.f1802f;
            Intent intent = new Intent("android.intent.action.CREATE_DOCUMENT");
            intent.addCategory("android.intent.category.OPENABLE");
            intent.setType("application/octet-stream");
            intent.putExtra("android.intent.extra.TITLE", "Solaris-recovery.solaris-core");
            activity.startActivityForResult(intent, 6142);
        } catch (Exception unused) {
            m.j0(this.f1803g, null, 1, null);
        }
    }
}
