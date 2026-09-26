package L5;

import android.app.Activity;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class l implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1757f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ m f1758g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Activity f1759h;

    public /* synthetic */ l(long j6, m mVar, Activity activity) {
        this.f1757f = j6;
        this.f1758g = mVar;
        this.f1759h = activity;
    }

    @Override // java.lang.Runnable
    public final void run() {
        m.q(this.f1757f, this.f1758g, this.f1759h);
    }
}
