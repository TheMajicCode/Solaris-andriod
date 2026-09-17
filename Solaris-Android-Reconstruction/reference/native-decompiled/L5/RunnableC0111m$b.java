package L5;

import android.app.Activity;

/* JADX INFO: renamed from: L5.m$b, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0111m$b implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1789f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ boolean f1790g;

    RunnableC0111m$b(m mVar, boolean z6) {
        this.f1789f = mVar;
        this.f1790g = z6;
    }

    @Override // java.lang.Runnable
    public final void run() {
        a aVar = a.f1734a;
        Activity activityA = this.f1789f.a().a();
        aVar.a(activityA != null ? activityA.getWindow() : null, this.f1790g);
    }
}
